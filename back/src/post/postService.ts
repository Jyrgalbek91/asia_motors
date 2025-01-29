import path from "path";
import Config from "../utils/config";
import db from "../utils/db";
import fs from "fs";

const ALLOW_HOST = Config.ALLOW_HOST;
const FILE_POST_URL = Config.FILE_POST_URL;
const FILE_POST_PATH = Config.FILE_POST_PATH;

async function getPostById(id_post: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT 
         p.id AS post_id, 
         p.id_type, 
         pt.type_name,
         p.title, 
         p.description, 
         p.date, 
         p.updated_at, 
         p.active, 
         g.id_image, 
         g.image_name 
       FROM post p 
       JOIN image g ON p.id = g.id_post
       JOIN post_type pt ON pt.id_post_type = p.id_type
       WHERE p.id = $1;`,
      [id_post]
    );

    if (error || rows.length === 0) {
      return false;
    }

    const post = {
      id: rows[0].post_id,
      id_type: rows[0].id_type,
      type_name: rows[0].type_name,
      title: rows[0].title,
      description: rows[0].description,
      date: rows[0].date,
      updated_at: rows[0].updated_at,
      active: rows[0].active,
      images: rows.map((row) => ({
        id_image: row.id_image,
        image_name: row.image_name
          ? `${ALLOW_HOST}${FILE_POST_URL}image-${row.image_name}`
          : null,
      })),
    };

    return post;
  } catch (error) {
    console.log("error getPostById: ", error.message);
    return false;
  }
}

async function getAllPosts(id_type: number, page: number, offset: number, isAdmin: boolean) {
  try {
    const limit = offset;
    const offsetValue = (page - 1) * offset;

    const { error: countError, rows: countRows } = await db.query(
      `SELECT COUNT(*) AS total
       FROM post 
       WHERE active = true
         AND id_type = $1;`,
      [id_type]
    );

    if (countError || countRows.length === 0) {
      return false;
    }

    const total = parseInt(countRows[0].total, 10);

    const { error, rows } = await db.query(
      `SELECT 
          p.id, 
          p.id_type, 
          pt.type_name,
          p.title, 
          p.description, 
          p."date", 
          p.updated_at, 
          p.active,
          ARRAY_AGG(JSON_BUILD_OBJECT('id', i.id_image, 'image_name', i.image_name)) AS images
        FROM post p
        LEFT JOIN image i ON i.id_post = p.id
        JOIN post_type pt ON pt.id_post_type = p.id_type
        WHERE p.id_type = $1
        ${isAdmin ? "" : "AND p.active = true"}  
        GROUP BY p.id, p.id_type, pt.type_name, p.title, p.description, p."date", p.updated_at, p.active
        ORDER BY p.updated_at DESC
        LIMIT $2 OFFSET $3;`,
      [id_type, limit, offsetValue]
    );

    if (error) {
      return false;
    }

    const posts = rows.map((post: any) => ({
      ...post,
      images: post.images.map((image: any) => ({
        ...image,
        image_name: image.image_name
          ? `${ALLOW_HOST}${FILE_POST_URL}image-${image.image_name}`
          : null,
      })),
    }));

    return {
      data: posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.log("error getAllPosts: ", error.message);
    return false;
  }
}

async function create(
  id_type: number,
  title: string,
  description: string,
  images: string[],
  date: string
) {
  try {
    const result_message = "";
    const { error, rows } = await db.query(
      `CALL p_insert_post($1::integer, $2::text, $3::text, $4::text[], $5::date, $6::text);`,
      [id_type, title, description, images, date, result_message]
    );
    if (error) {
      console.error("Error while inserting post:", error);
      return false;
    }

    return rows;
  } catch (error: any) {
    console.error("Error in create:", error.message);
    return false;
  }
}

async function deletePostById(id_post: number) {
  try {
    const { rows: images } = await db.query(
      `SELECT image_name FROM image WHERE id_post = $1`,
      [id_post]
    );

    if (images.length > 0) {
      images.forEach((image: any) => {
        const imagePath = path.join(
          `${FILE_POST_PATH}image-${image.image_name}`
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      await db.query(`DELETE FROM image WHERE id_post = $1`, [id_post]);
    }

    await db.query(`DELETE FROM post WHERE id = $1`, [id_post]);

    return true;
  } catch (error) {
    console.error("Error deleting post and images:", error);
    return false;
  }
}

async function updatePostById(id_post: number, data: any) {
  try {
    const { title, description, id_type, images_to_delete, images, active, date } = data;

    let updateFields: string[] = [];
    let updateValues: any[] = [];

    if (title !== undefined) {
      updateFields.push(`title = $${updateValues.length + 1}`);
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${updateValues.length + 1}`);
      updateValues.push(description);
    }
    if (id_type !== undefined) {
      updateFields.push(`id_type = $${updateValues.length + 1}`);
      updateValues.push(id_type);
    }

    if (date !== undefined) {
      updateFields.push(`"date" = $${updateValues.length + 1}`);
      updateValues.push(date); 
    }

    const activeValue = active === "false" ? false : active || true;
    updateFields.push(`active = $${updateValues.length + 1}`);
    updateValues.push(activeValue);

    if (updateFields.length > 0) {
      await db.query(
        `UPDATE post SET ${updateFields.join(", ")} WHERE id = $${updateValues.length + 1}`,
        [...updateValues, id_post]
      );
    }

    if (images_to_delete && images_to_delete.length > 0) {
      const { rows: images } = await db.query(
        `SELECT image_name FROM image WHERE id_image = ANY($1)`,
        [images_to_delete]
      );

      images.forEach((image: any) => {
        const imagePath = path.join(
          `${FILE_POST_PATH}image-${image.image_name}`
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      await db.query(`DELETE FROM image WHERE id_image = ANY($1)`, [
        images_to_delete,
      ]);
    }

    if (images && images.length > 0) {
      const insertImageQueries = images.map((image: any) => {
        return db.query(
          `INSERT INTO image (id_post, image_name) VALUES ($1, $2)`,
          [id_post, image.image_name]
        );
      });

      await Promise.all(insertImageQueries);
    }

    return true;
  } catch (error) {
    console.error("Error updating post and images:", error);
    return false;
  }
}

async function similarArticles(title: string, currentPostId: number): Promise<any> {
  try {
    const keywords = title
      .replace(/[^\w\sа-яА-Я]/g, "")
      .split(" ")
      .filter((word) => word.length > 3)
      .join(" | ");

    const { rows } = await db.query(
      `SELECT p.id,
              p.id_type,
              p.title,
              p.description,
              p."date",
              p.updated_at,
              p.active,
              ARRAY_AGG(JSON_BUILD_OBJECT('id', i.id_image, 'image_name', i.image_name)) AS images
       FROM post p
       JOIN image i ON p.id = i.id_post
       WHERE p.id_type = 1 
         AND p.tsv_content @@ to_tsquery('russian', $1)
         AND p.id != $2
       GROUP BY p.id, p.id_type, p.title, p.description, p."date", p.updated_at, p.active
       ORDER BY ts_rank(p.tsv_content, to_tsquery('russian', $1)) DESC
       LIMIT 3;`,
      [keywords, currentPostId]
    );                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

    return rows.map((post: any) => ({
      ...post,
      images: post.images.map((image: any) => ({
        ...image,
        image_name: image.image_name
          ? `${ALLOW_HOST}${FILE_POST_URL}image-${image.image_name}`
          : null,
      })),
    }));
  } catch (error: any) {
    console.error("Error in similarArticles:", error.message);
    return [];
  }
}

const PostService = {
  getPostById,
  getAllPosts,
  create,
  deletePostById,
  updatePostById,
  similarArticles,
};

export default PostService;

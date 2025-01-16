import path from "path";
import Config from "../utils/config";
import db from "../utils/db";
import fs from "fs";

const ALLOW_HOST = Config.ALLOW_HOST;
const PDF_FILE_PATH = Config.PDF_FILE_PATH;
const PDF_FILE_URL = Config.PDF_FILE_URL;
const FILE_VEHICLE_URL = Config.FILE_VEHICLE_URL;
const FILE_VEHICLE_PATH = Config.FILE_VEHICLE_PATH;

async function create(
  id_type: number,
  id_brand: number,
  id_model: number,
  id_capacity: number | null,
  id_box: number | null,
  description: string,
  images: string[],
  pdf_file: string,
  id_mass: number | null,
  id_bucket: number | null
) {
  try {
    const result_message = "";
    const { error, rows } = await db.query(
      `CALL p_insert_vehicle($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
      [
        id_type,
        id_brand,
        id_model,
        id_capacity ?? null,
        id_box ?? null,
        description,
        images,
        pdf_file,
        id_mass ?? null,
        id_bucket ?? null,
        result_message,
      ]
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

async function getVehicleById(id_vehicle: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT 
         v.id AS vehicle_id, 
         v.id_type, 
         vt.type_name,
         v.id_brand, 
         b.brand_name,
         v.id_model,
         m.model_name,
         v.id_capacity,
         c.capacity_name,
         v.id_box,
         bx.box_name,
         v.id_mass,
         ms.mass_name,
         v.id_bucket,
         bc.bucket_name,
         v.description, 
         v.date, 
         v.updated_at, 
         v.active, 
         g.id_image, 
         g.image_name 
       FROM vehicle v 
       JOIN image g ON v.id = g.id_vehicle
       JOIN vehicle_type vt ON vt.id_vehicle_type = v.id_type
       JOIN brand b USING(id_brand)
       JOIN model m USING(id_model)
       JOIN capacity c USING(id_capacity)
       JOIN box bx USING(id_box)
       JOIN mass ms USING(id_mass)
       JOIN bucket bc USING(id_bucket)
       WHERE v.id = $1;`,
      [id_vehicle]
    );

    if (error || rows.length === 0) {
      return false;
    }

    const vehicle = {
      id: rows[0].vehicle_id,
      id_type: rows[0].id_type,
      type_name: rows[0].type_name,
      id_brand: rows[0].id_brand,
      brand_name: rows[0].brand_name,
      id_model: rows[0].id_model,
      model_name: rows[0].model_name,
      id_capacity: rows[0].id_capacity,
      capacity_name: rows[0].capacity_name,
      id_box: rows[0].id_box,
      box_name: rows[0].box_name,
      id_mass: rows[0].id_mass,
      mass_name: rows[0].mass_name,
      id_bucket: rows[0].id_bucket,
      bucket_name: rows[0].bucket_name,
      description: rows[0].description,
      date: rows[0].date,
      updated_at: rows[0].updated_at,
      active: rows[0].active,
      images: rows.map((row) => ({
        id_image: row.id_image,
        image_name: row.image_name
          ? `${ALLOW_HOST}${FILE_VEHICLE_URL}image-${row.image_name}`
          : null,
      })),
    };

    return vehicle;
  } catch (error) {
    console.log("error getVehicleById: ", error.message);
    return false;
  }
}

async function getAllVehicles(
  id_type: number,
  page: number,
  offset: number,
  filters: {
    id_brand?: number;
    id_model?: number;
    id_capacity?: number;
    id_box?: number;
    id_mass?: number;
    id_bucket?: number;
  }
) {
  try {
    const limit = offset;
    const offsetValue = (page - 1) * offset;

    let query = `
      SELECT 
        v.id, 
        v.id_type, 
        vt.type_name,
        v.id_brand,
        b.brand_name,
        v.id_model,
        m.model_name,
        v.id_capacity,
        c.capacity_name,
        v.id_box,
        bx.box_name, 
        v.id_mass,
        mas.mass_name,
        v.id_bucket,
        buck.bucket_name,
        v.description, 
        v."date", 
        v.updated_at, 
        v.active,
        ARRAY_AGG(JSON_BUILD_OBJECT('id', i.id_image, 'image_name', i.image_name)) AS images,
        v.pdf_file
      FROM vehicle v 
      JOIN image i ON i.id_vehicle = v.id 
      JOIN vehicle_type vt ON vt.id_vehicle_type = v.id_type 
      JOIN brand b USING(id_brand)
      JOIN model m USING(id_model)
      LEFT JOIN capacity c USING(id_capacity)
      LEFT JOIN "box" bx USING(id_box)
      LEFT JOIN mass mas USING(id_mass)
      LEFT JOIN bucket buck USING(id_bucket)
      WHERE v.active = true
        AND v.id_type = $1
    `;

    const filterValues: any[] = [id_type];
    let filterConditions = "";

    if (filters.id_brand) {
      filterConditions += ` AND v.id_brand = $${filterValues.length + 1}`;
      filterValues.push(filters.id_brand);
    }
    if (filters.id_model) {
      filterConditions += ` AND v.id_model = $${filterValues.length + 1}`;
      filterValues.push(filters.id_model);
    }
    if (filters.id_capacity) {
      filterConditions += ` AND v.id_capacity = $${filterValues.length + 1}`;
      filterValues.push(filters.id_capacity);
    }
    if (filters.id_box) {
      filterConditions += ` AND v.id_box = $${filterValues.length + 1}`;
      filterValues.push(filters.id_box);
    }
    if (filters.id_mass) {  
      filterConditions += ` AND v.id_mass = $${filterValues.length + 1}`;
      filterValues.push(filters.id_mass);
    }
    if (filters.id_bucket) {  
      filterConditions += ` AND v.id_bucket = $${filterValues.length + 1}`;
      filterValues.push(filters.id_bucket);
    }

    query += filterConditions;

    query += `
      GROUP BY v.id,
               v.id_type,
               vt.type_name, 
               v.id_brand, 
               b.brand_name, 
               v.id_model, 
               m.model_name, 
               v.id_capacity, 
               c.capacity_name, 
               v.id_box, 
               bx.box_name,
               v.id_mass,
               mas.mass_name,
               v.id_bucket,
               buck.bucket_name, 
               v.description, 
               v."date", 
               v.updated_at, 
               v.active,
               v.pdf_file
      ORDER BY v.updated_at DESC
      LIMIT $${filterValues.length + 1} OFFSET $${filterValues.length + 2};
    `;

    filterValues.push(limit, offsetValue);

    const { error, rows } = await db.query(query, filterValues);

    return error
      ? false
      : rows.map((vehicle: any) => ({
          ...vehicle,
          pdf_file: vehicle.pdf_file
            ? `${ALLOW_HOST}${PDF_FILE_URL}${vehicle.pdf_file}`
            : null,
          images: vehicle.images.map((image: any) => ({
            ...image,
            image_name: image.image_name
              ? `${ALLOW_HOST}${FILE_VEHICLE_URL}image-${image.image_name}`
              : null,
          })),
        }));
  } catch (error) {
    console.log("error getAllVehicles: ", error.message);
    return false;
  }
}

async function deleteVehicleById(id_vehicle: number) {
  try {
    const { rows: vehicleRows } = await db.query(
      `SELECT pdf_file FROM vehicle WHERE id = $1`,
      [id_vehicle]
    );

    if (vehicleRows.length > 0 && vehicleRows[0].pdf_file) {
      const pdfFile = path.join(`${PDF_FILE_PATH}${vehicleRows[0].pdf_file}`);

      if (fs.existsSync(pdfFile)) {
        fs.unlinkSync(pdfFile); 
      }
    }

    const { rows: images } = await db.query(
      `SELECT image_name FROM image WHERE id_vehicle = $1`,
      [id_vehicle]
    );

    if (images.length > 0) {
      images.forEach((image: any) => {
        const imagePath = path.join(
          `${FILE_VEHICLE_PATH}image-${image.image_name}`
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      await db.query(`DELETE FROM image WHERE id_vehicle = $1`, [id_vehicle]);
    }

    await db.query(`DELETE FROM vehicle WHERE id = $1`, [id_vehicle]);

    return true;
  } catch (error) {
    console.error("Error deleting vehicle, images, or pdf:", error);
    return false;
  }
}

async function updateVehicleById(id_vehicle: number, data: any) {
  try {
    const {
      id_type,
      id_brand,
      id_model,
      id_capacity,
      id_box,
      description,
      pdf_file,
      id_mass,
      id_bucket,
      images_to_delete,
    } = data;

    const active = true;

    let oldPdfFileName = null;
    const { rows: vehicleRows } = await db.query(
      `SELECT pdf_file FROM vehicle WHERE id = $1`,
      [id_vehicle]
    );
    if (vehicleRows.length > 0) {
      oldPdfFileName = vehicleRows[0].pdf_file;
    }

    let updateFields: string[] = [];
    let updateValues: any[] = [];

    if (id_type !== undefined) {
      updateFields.push("id_type = $1");
      updateValues.push(id_type);
    }
    if (id_brand !== undefined) {
      updateFields.push("id_brand = $2");
      updateValues.push(id_brand);
    }
    if (id_model !== undefined) {
      updateFields.push("id_model = $3");
      updateValues.push(id_model);
    }
    if (id_capacity !== undefined) {
      updateFields.push("id_capacity = $4");
      updateValues.push(id_capacity);
    }
    if (id_box !== undefined) {
      updateFields.push("id_box = $5");
      updateValues.push(id_box);
    }
    if (description !== undefined) {
      updateFields.push("description = $6");
      updateValues.push(description);
    }
    if (id_mass !== undefined) {
      updateFields.push("id_mass = $7");
      updateValues.push(id_mass);
    }
    if (id_bucket !== undefined) {
      updateFields.push("id_bucket = $8");
      updateValues.push(id_bucket);
    }

    updateFields.push("active = $9");
    updateValues.push(active);
    updateFields.push("updated_at = NOW()");

    await db.query(
      `UPDATE vehicle SET ${updateFields.join(", ")} WHERE id = $${updateValues.length + 1}`,
      [...updateValues, id_vehicle]
    );

    if (pdf_file) {
      if (oldPdfFileName && oldPdfFileName !== pdf_file) {
        const oldPdfFilePath = path.join(PDF_FILE_PATH, oldPdfFileName);
        if (fs.existsSync(oldPdfFilePath)) {
          fs.unlinkSync(oldPdfFilePath);
        }
      }

      await db.query(
        `UPDATE vehicle SET pdf_file = $1 WHERE id = $2`,
        [pdf_file, id_vehicle]
      );
    }

    if (images_to_delete && images_to_delete.length > 0) {
      const { rows: images } = await db.query(
        `SELECT image_name FROM image WHERE id_image = ANY($1)`,
        [images_to_delete]
      );

      images.forEach((image: any) => {
        const imagePath = path.join(
          `${FILE_VEHICLE_PATH}image-${image.image_name}`
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      await db.query(`DELETE FROM image WHERE id_image = ANY($1)`, [
        images_to_delete,
      ]);
    }

    if (data.images && data.images.length > 0) {
      const insertImageQueries = data.images.map((image: any) => {
        return db.query(
          `INSERT INTO image (id_vehicle, image_name) VALUES ($1, $2)`,
          [id_vehicle, image.image_name]
        );
      });

      await Promise.all(insertImageQueries);
    }

    return true;
  } catch (error) {
    console.error("Error updating vehicle and images:", error);
    return false;
  }
}



const VehicleService = {
  create,
  getVehicleById,
  getAllVehicles,
  deleteVehicleById,
  updateVehicleById,
};

export default VehicleService;

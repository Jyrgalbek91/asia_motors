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
         v.id_fuel,
         f.fuel_name,
         v.id_body,
         bd.body_name,
         v.power,
         v.color,
         v.description, 
         v.date, 
         v.updated_at, 
         v.active, 
         g.id_image, 
         g.image_name 
       FROM vehicle v 
       LEFT JOIN image g ON v.id = g.id_vehicle
       LEFT JOIN vehicle_type vt ON vt.id_vehicle_type = v.id_type
       LEFT JOIN brand b USING(id_brand)
       LEFT JOIN model m USING(id_model)
       LEFT JOIN capacity c USING(id_capacity)
       LEFT JOIN box bx USING(id_box)
       LEFT JOIN mass ms USING(id_mass)
       LEFT JOIN bucket bc USING(id_bucket)
       LEFT JOIN fuel f USING(id_fuel)
       LEFT JOIN body bd USING(id_body)
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
      id_fuel: rows[0].id_fuel,
      fuel_name: rows[0].fuel_name,
      id_body: rows[0].id_body,
      body_name: rows[0].body_name,
      power: rows[0].power,
      color: rows[0].color,
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
        v.id_fuel,
        f.fuel_name,
        v.id_body,
        bd.body_name,
        v.power,
        v.color,
        v.description, 
        v."date", 
        v.updated_at, 
        v.active,
        ARRAY_AGG(JSON_BUILD_OBJECT('id', i.id_image, 'image_name', i.image_name)) AS images,
        v.pdf_file
      FROM vehicle v 
      LEFT JOIN image i ON i.id_vehicle = v.id 
      JOIN vehicle_type vt ON vt.id_vehicle_type = v.id_type 
      JOIN brand b USING(id_brand)
      JOIN model m USING(id_model)
      LEFT JOIN capacity c USING(id_capacity)
      LEFT JOIN "box" bx USING(id_box)
      LEFT JOIN mass mas USING(id_mass)
      LEFT JOIN bucket buck USING(id_bucket)
      LEFT JOIN fuel f USING(id_fuel)
      LEFT JOIN body bd USING(id_body)
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
               v.id_fuel,
               f.fuel_name,
               v.id_body,
               bd.body_name,
               v.power,
               v.color,
               v.description, 
               v."date", 
               v.updated_at, 
               v.active,
               v.pdf_file
      ORDER BY v.updated_at DESC
      LIMIT $${filterValues.length + 1} OFFSET $${filterValues.length + 2};
    `;

    filterValues.push(limit, offsetValue);

    const { error: countError, rows: countRows } = await db.query(
      `SELECT COUNT(*) AS total
       FROM vehicle v 
       WHERE v.active = true
         AND v.id_type = $1
         ${filterConditions};`,
      [id_type, ...Object.values(filters)]
    );

    if (countError || countRows.length === 0) {
      return false;
    }

    const total = parseInt(countRows[0].total, 10);

    const { error, rows } = await db.query(query, filterValues);

    if (error) {
      return false;
    }

    const vehicles = rows.map((vehicle: any) => ({
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

    return {
      data: vehicles,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
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
      `UPDATE vehicle SET ${updateFields.join(", ")} WHERE id = $${
        updateValues.length + 1
      }`,
      [...updateValues, id_vehicle]
    );

    if (pdf_file) {
      if (oldPdfFileName && oldPdfFileName !== pdf_file) {
        const oldPdfFilePath = path.join(PDF_FILE_PATH, oldPdfFileName);
        if (fs.existsSync(oldPdfFilePath)) {
          fs.unlinkSync(oldPdfFilePath);
        }
      }

      await db.query(`UPDATE vehicle SET pdf_file = $1 WHERE id = $2`, [
        pdf_file,
        id_vehicle,
      ]);
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

async function saveVehicle(
  id_type: number,
  id_brand: number,
  id_model: number,
  id_capacity: number | null,
  id_box: number | null,
  description: string,
  id_mass: number | null,
  id_bucket: number | null,
  id_fuel: number | null,
  id_body: number | null,
  power: string | null,
  color: string | null
) {
  try {
    const result_message = "";
    const { error, rows } = await db.query(
      `CALL p_insert_vehicle($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`,
      [
        id_type,
        id_brand,
        id_model,
        id_capacity ?? null,
        id_box ?? null,
        description,
        id_mass ?? null,
        id_bucket ?? null,
        id_fuel ?? null,
        id_body ?? null,
        power ?? null,
        color ?? null,
        result_message,
      ]
    );
    if (error) {
      return false;
    }

    return rows;
  } catch (error: any) {
    console.error("Error in saveVehicle:", error.message);
    return false;
  }
}

async function updateVehicle(
  id_vehicle: number,
  id_type: number,
  id_brand: number,
  id_model: number,
  id_capacity: number,
  id_box: number,
  description: string,
  id_mass: number,
  id_bucket: number,
  id_fuel: number,
  id_body: number,
  power: string,
  color: string,
  active: boolean
) {
  try {
    const result_message = "";
    const { error, rows } = await db.query(
      `CALL p_update_vehicle($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`,
      [
        id_vehicle,
        id_type,
        id_brand,
        id_model,
        id_capacity,
        id_box,
        description,
        id_mass,
        id_bucket,
        id_fuel,
        id_body,
        power,
        color,
        active,
        result_message,
      ]
    );

    if (error) {
      return false;
    }
    return rows;
  } catch (error: any) {
    console.error("Error in updateVehicle:", error.message);
    return false;
  }
}

async function addImage(id: number, images: string[]) {
  try {
    const result_message = "";
    const { error, rows } = await db.query(`CALL p_insert_image($1, $2, $3);`, [
      id,
      images,
      result_message,
    ]);
    if (error) {
      return false;
    }

    return rows;
  } catch (error: any) {
    console.error("Error in addImage:", error.message);
    return false;
  }
}

async function addFiles(id: number, pdf_file: string) {
  try {
    const { error, rows } = await db.query(
      `UPDATE vehicle
       SET pdf_file = $2
       WHERE id = $1;`,
      [id, pdf_file]
    );
    if (error) {
      return false;
    }

    return rows;
  } catch (error: any) {
    console.error("Error in addFiles:", error.message);
    return false;
  }
}

async function deleteImage(id_image: number) {
  try {
    const { rows: images } = await db.query(
      `SELECT image_name FROM image WHERE id_image = $1`,
      [id_image]
    );

    if (images.length > 0) {
      const image = images[0];
      const imagePath = path.join(
        `${FILE_VEHICLE_PATH}image-${image.image_name}`
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      await db.query(`DELETE FROM image WHERE id_image = $1`, [id_image]);

      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.error("Error in deleteImage:", error.message);
    return false;
  }
}

async function deleteFile(id_vehicle: number) {
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

      await db.query(`UPDATE vehicle SET pdf_file = NULL WHERE id = $1`, [id_vehicle]);

      return true; 
    } else {
      return false; 
    }
  } catch (error: any) {
    console.error("Error in deleteFile:", error.message);
    return false; 
  }
}

const VehicleService = {
  create,
  getVehicleById,
  getAllVehicles,
  deleteVehicleById,
  updateVehicleById,
  saveVehicle,
  updateVehicle,
  addImage,
  addFiles,
  deleteImage,
  deleteFile,
};

export default VehicleService;

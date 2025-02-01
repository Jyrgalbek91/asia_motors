import db from "../utils/db";
import fs from "fs";
import path from "path";
import Config from "../utils/config";

const ALLOW_HOST = Config.ALLOW_HOST;
const PDF_FILE_URL = Config.PDF_FILE_URL;
const FILE_VEHICLE_URL = Config.FILE_VEHICLE_URL;
const PDF_FILE_PATH = Config.PDF_FILE_PATH;

async function createPdfFile(id_vehicle: number, pdf_file: string) {
  try {
    const { error, rows } = await db.query(
      `UPDATE vehicle SET pdf_file = $2
       WHERE id = $1
       RETURNING id;`,
      [id_vehicle, pdf_file]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error createPdfFile: ", error.message);
    return false;
  }
}

async function createImageFile(id_vehicle: number, image_name: string) {
  try {
    const { error, rows } = await db.query(
      `INSERT INTO image(id_vehicle, image_name)
       VALUES($1, $2)
       RETURNING id_image;`,
      [id_vehicle, image_name]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error createImageFile: ", error.message);
    return false;
  }
}

async function getVehicleData(id_vehicle: number) {
  try {
    const { rows } = await db.query(
      `SELECT v.id AS id_vehicle, v.vehicle_name, v.pdf_file, i.id_image AS id_image, i.image_name 
       FROM vehicle v
       LEFT JOIN image i ON v.id = i.id_vehicle 
       WHERE v.id = $1;`,
      [id_vehicle]
    );

    if (!rows.length) {
      return null;
    }

    const vehicle = rows[0];

    return {
      id_vehicle: vehicle.id_vehicle,
      vehicle_name: vehicle.vehicle_name,
      file_name: vehicle.pdf_file
        ? `${ALLOW_HOST}${PDF_FILE_URL}${vehicle.pdf_file}`
        : null,
      image_name: vehicle.image_name
        ? `${ALLOW_HOST}${FILE_VEHICLE_URL}image-${vehicle.image_name}`
        : null,
    };
  } catch (error) {
    console.error("Ошибка getVehicleData: ", error.message);
    return null;
  }
}

async function getVehicleFiles(id_vehicle: number) {
  try {
    const { rows } = await db.query(
      `SELECT pdf_file, image_name FROM vehicle 
       LEFT JOIN image ON vehicle.id = image.id_vehicle 
       WHERE vehicle.id = $1;`,
      [id_vehicle]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Ошибка getVehicleData: ", error.message);
    return null;
  }
}

async function updateVehicleFiles(
  id_vehicle: number,
  pdf_file: string | null,
  image: string | null
) {
  try {
    const oldFiles = await getVehicleFiles(id_vehicle);

    if (oldFiles) {
      if (oldFiles.pdf_file && pdf_file) {
        const oldPdfPath = path.join(Config.PDF_FILE_PATH, oldFiles.pdf_file);
        if (fs.existsSync(oldPdfPath)) fs.unlinkSync(oldPdfPath);
      }

      if (oldFiles.image_name && image) {
        const oldImagePath = path.join(
          Config.FILE_POST_PATH,
          oldFiles.image_name
        );
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
    }

    if (pdf_file) {
      const { error } = await db.query(
        `UPDATE vehicle SET pdf_file = $2 WHERE id = $1;`,
        [id_vehicle, pdf_file]
      );
      if (error) return false;
    }

    if (image) {
      const { error } = await db.query(
        `UPDATE image SET image_name = $2 WHERE id_vehicle = $1;`,
        [id_vehicle, image]
      );
      if (error) return false;
    }

    return true;
  } catch (error) {
    console.error("Ошибка updateVehicleFiles: ", error.message);
    return false;
  }
}

async function deleteFileById(id: number) {
  try {
    const { rows: fileRows } = await db.query(
      `SELECT pdf_file FROM vehicle WHERE id = $1`,
      [id]
    );

    if (fileRows.length > 0 && fileRows[0].pdf_file) {
      const pdfFile = path.join(PDF_FILE_PATH, fileRows[0].pdf_file);

      if (fs.existsSync(pdfFile)) {
        fs.unlinkSync(pdfFile);
      }
    }

    await db.query(`UPDATE vehicle SET pdf_file = null WHERE id = $1`, [id]);

    return true;
  } catch (error) {
    console.error("Error deleting pdf:", error);
    return false;
  }
}

const VehicleService = {
  createPdfFile,
  createImageFile,
  updateVehicleFiles,
  getVehicleFiles,
  getVehicleData,
  deleteFileById,
};

export default VehicleService;

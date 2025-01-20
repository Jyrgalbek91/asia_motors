import path from "path";
import db from "../utils/db";
import fs from "fs";
import Config from "../utils/config";

const PDF_FILE_PATH = Config.PDF_FILE_PATH;
const ALLOW_HOST = Config.ALLOW_HOST;
const PDF_FILE_URL = Config.PDF_FILE_URL;

async function saveFiles(
  vehicle_name: string,
  file_name: string,
  title: string
) {
  try {
    const checkQuery = `
      SELECT id_file 
      FROM files 
      WHERE vehicle_name = $1 AND title = $2;
    `;
    const { rows: existingRows } = await db.query(checkQuery, [
      vehicle_name,
      title,
    ]);

    if (existingRows.length > 0) {
      const updateQuery = `
        UPDATE files
        SET file_name = $1
        WHERE id_file = $2
        RETURNING id_file;
      `;
      const { rows: updatedRows } = await db.query(updateQuery, [
        file_name,
        existingRows[0].id_file,
      ]);
      return updatedRows;
    } else {
      const insertQuery = `
        INSERT INTO files(vehicle_name, file_name, title)
        VALUES($1, $2, $3)
        RETURNING id_file;
      `;
      const { rows: insertedRows } = await db.query(insertQuery, [
        vehicle_name,
        file_name,
        title,
      ]);
      return insertedRows;
    }
  } catch (error) {
    console.log("error saveFiles: ", error.message);
    return false;
  }
}

async function updateFiles(id_file: number, data: any) {
  try {
    const { file_name, title } = data;
    let oldPdfFileName = null;
    let updateResult = null;

    const { rows: vehicleRows } = await db.query(
      `SELECT file_name FROM files WHERE id_file = $1`,
      [id_file]
    );

    if (vehicleRows.length > 0) {
      oldPdfFileName = vehicleRows[0].file_name;
    }

    if (file_name) {
      if (oldPdfFileName && oldPdfFileName !== file_name) {
        const oldPdfFilePath = path.join(PDF_FILE_PATH, oldPdfFileName);
        if (fs.existsSync(oldPdfFilePath)) {
          fs.unlinkSync(oldPdfFilePath);
        }
      }
    }

    const fields = [];
    const values = [];

    if (file_name) {
      fields.push("file_name = $" + (fields.length + 1));
      values.push(file_name);
    }

    if (title) {
      fields.push("title = $" + (fields.length + 1));
      values.push(title);
    }

    if (fields.length > 0) {
      values.push(id_file);
      updateResult = await db.query(
        `UPDATE files SET ${fields.join(", ")} WHERE id_file = $${fields.length + 1}`,
        values
      );
    }

    return updateResult;
  } catch (error) {
    console.log("error updateFiles: ", error.message);
    return false;
  }
}

async function deleteStorageById(id_file: number) {
  try {
    const { rows: fileRows } = await db.query(
      `SELECT file_name FROM files WHERE id_file = $1`,
      [id_file]
    );

    if (fileRows.length > 0 && fileRows[0].file_name) {
      const pdfFile = path.join(`${PDF_FILE_PATH}${fileRows[0].file_name}`);

      if (fs.existsSync(pdfFile)) {
        fs.unlinkSync(pdfFile);
      }
    }

    await db.query(`DELETE FROM files WHERE id_file = $1`, [id_file]);

    return true;
  } catch (error) {
    console.error("Error deleting pdf:", error);
    return false;
  }
}

async function getFiles(vehicle_name: string) {
  try {
    const { error, rows } = await db.query(
      `SELECT id_file, title, file_name FROM files
       WHERE vehicle_name = $1;`,
      [vehicle_name]
    );
    if (error) return false;

    const data = rows.map((row) => ({
      ...row,
      file_name: `${ALLOW_HOST}${PDF_FILE_URL}${row.file_name}`,
    }));
    return data;
  } catch (error) {
    console.log("error getFiles: ", error.message);
    return false;
  }
}

async function saveInfoFiles(vehicle_name: string, file_name: string) {
  try {
    const { error, rows } = await db.query(
      `INSERT INTO files(vehicle_name, file_name)
             VALUES($1, $2)
             RETURNING id_file;`,
      [vehicle_name, file_name]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error saveInfoFiles: ", error.message);
    return false;
  }
}

async function getInfoFiles(vehicle_name: string) {
  try {
    const { error, rows } = await db.query(
      `SELECT id_file, file_name FROM files
       WHERE vehicle_name = $1;`,
      [vehicle_name]
    );
    if (error) return false;

    const data = rows.map((row) => ({
      ...row,
      file_name: `${ALLOW_HOST}${PDF_FILE_URL}${row.file_name}`,
    }));
    return data;
  } catch (error) {
    console.log("error getInfoFiles: ", error.message);
    return false;
  }
}

async function deleteInfoStorageById(id_file: number) {
  try {
    const { rows: fileRows } = await db.query(
      `SELECT file_name FROM files WHERE id_file = $1`,
      [id_file]
    );

    if (fileRows.length > 0 && fileRows[0].file_name) {
      const pdfFile = path.join(`${PDF_FILE_PATH}${fileRows[0].file_name}`);

      if (fs.existsSync(pdfFile)) {
        fs.unlinkSync(pdfFile);
      }
    }

    await db.query(`DELETE FROM files WHERE id_file = $1`, [id_file]);

    return true;
  } catch (error) {
    console.error("Error deleting pdf:", error);
    return false;
  }
}

const StorageService = {
  saveFiles,
  updateFiles,
  deleteStorageById,
  getFiles,
  saveInfoFiles,
  getInfoFiles,
  deleteInfoStorageById,
};

export default StorageService;

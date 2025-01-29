import path from "path";
import db from "../utils/db";
import fs from "fs";
import Config from "../utils/config";

const PDF_FILE_PATH = Config.PDF_FILE_PATH;
const ALLOW_HOST = Config.ALLOW_HOST;
const PDF_FILE_URL = Config.PDF_FILE_URL;

async function saveFiles(id_vehicle: number, file_name: string, title: string) {
  try {
    const checkQuery = `
      SELECT id_file 
      FROM files 
      WHERE id_vehicle = $1 AND title = $2;
    `;
    const { rows: existingRows } = await db.query(checkQuery, [
      id_vehicle,
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
        INSERT INTO files(id_vehicle, file_name, title)
        VALUES($1, $2, $3)
        RETURNING id_file;
      `;
      const { rows: insertedRows } = await db.query(insertQuery, [
        id_vehicle,
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
    const { file_name } = data;
    let oldPdfFileName = null;
    let updateResult = null;

    const { rows: vehicleRows } = await db.query(
      `SELECT file_name FROM files WHERE id_file = $1`,
      [id_file]
    );

    if (vehicleRows.length > 0) {
      oldPdfFileName = vehicleRows[0].file_name;
    }

    if (file_name && oldPdfFileName && oldPdfFileName !== file_name) {
      const oldPdfFilePath = path.join(PDF_FILE_PATH, oldPdfFileName);
      if (fs.existsSync(oldPdfFilePath)) {
        fs.unlinkSync(oldPdfFilePath);
      }
    }

    const fields = [];
    const values = [];

    if (file_name) {
      fields.push(`file_name = $${fields.length + 1}`);
      values.push(file_name);
    }

    if (fields.length > 0) {
      values.push(id_file);
      updateResult = await db.query(
        `UPDATE files SET ${fields.join(", ")} WHERE id_file = $${
          fields.length + 1
        } RETURNING *`,
        values
      );
    }

    if (updateResult && updateResult.rows.length > 0) {
      return updateResult.rows.map((row) => ({
        ...row,
        file_name: `${ALLOW_HOST}${PDF_FILE_URL}${row.file_name}`,
      }));
    }

    return null;
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

async function getFiles(id_vehicle: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT id_file, title, file_name FROM files
       WHERE id_vehicle = $1 AND title IS NOT NULL
       ORDER BY id_file;`,
      [id_vehicle]
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

async function saveInfoFiles(id_vehicle: number, file_name: string) {
  try {
    const { error, rows } = await db.query(
      `INSERT INTO files(id_vehicle, file_name)
             VALUES($1, $2)
             RETURNING id_file;`,
      [id_vehicle, file_name]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error saveInfoFiles: ", error.message);
    return false;
  }
}

async function getInfoFiles(id_vehicle: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT id_file, file_name FROM files
       WHERE id_vehicle = $1 AND title IS NULL;`,
      [id_vehicle]
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

async function updateStorage(id_file: number, title: string) {
  try {
    const { error, rows } = await db.query(
      `UPDATE files SET title = $2 WHERE id_file = $1
       RETURNING *;`,
      [id_file, title]
    );
    if (error) return false;

    const data = rows.map((row) => ({
      ...row,
      file_name: `${ALLOW_HOST}${PDF_FILE_URL}${row.file_name}`,
    }));
    return data;
  } catch (error) {
    console.log("error updateStorage: ", error.message);
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
  updateStorage,
};

export default StorageService;

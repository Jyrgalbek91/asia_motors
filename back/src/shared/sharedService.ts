import db from "../utils/db";

async function getBrand(id_type: number) {
  try {
    const { rows, error } = await db.query(
      `SELECT id_brand, brand_name FROM brand WHERE id_type = $1;`,
      [id_type]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getBrand: ", error.message);
    return false;
  }
}

async function getModel(id_brand: number) {
  try {
    const { rows, error } = await db.query(
      `SELECT id_model, model_name FROM model WHERE id_brand = $1;`,
      [id_brand]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getModel: ", error.message);
    return false;
  }
}

async function getCapacity() {
  try {
    const { rows, error } = await db.query(`SELECT * FROM capacity;`, []);
    return error ? false : rows;
  } catch (error) {
    console.log("error getCapacity: ", error.message);
    return false;
  }
}

async function getBox() {
  try {
    const { rows, error } = await db.query(`SELECT * FROM box;`, []);
    return error ? false : rows;
  } catch (error) {
    console.log("error getBox: ", error.message);
    return false;
  }
}

async function getPostType() {
  try {
    const { rows, error } = await db.query(`SELECT * FROM post_type;`, []);
    return error ? false : rows;
  } catch (error) {
    console.log("error getPostType: ", error.message);
    return false;
  }
}

async function getVehicleType() {
  try {
    const { rows, error } = await db.query(`SELECT * FROM vehicle_type;`, []);
    return error ? false : rows;
  } catch (error) {
    console.log("error getVehicleType: ", error.message);
    return false;
  }
}

export default {
  getBrand,
  getModel,
  getCapacity,
  getBox,
  getPostType,
  getVehicleType,
};

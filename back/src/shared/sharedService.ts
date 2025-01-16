import db from "../utils/db";

<<<<<<< HEAD
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

async function getMassType() {
  try {
    const { rows, error } = await db.query(`SELECT * FROM mass;`, []);
    return error ? false : rows;
  } catch (error) {
    console.log("error getMassType: ", error.message);
    return false;
  }
}

async function getBucketType() {
  try {
    const { rows, error } = await db.query(`SELECT * FROM bucket;`, []);
    return error ? false : rows;
  } catch (error) {
    console.log("error getBucketType: ", error.message);
    return false;
  }
}

async function getFuelType() {
  try {
    const { rows, error } = await db.query(`SELECT * FROM fuel;`, []);
    return error ? false : rows;
  } catch (error) {
    console.log("error getFuelType: ", error.message);
    return false;
  }
}

async function getPowerType() {
  try {
    const { rows, error } = await db.query(`SELECT * FROM power;`, []);
    return error ? false : rows;
  } catch (error) {
    console.log("error getPowerType: ", error.message);
=======
async function getCitizenship() {
  try {
    const { rows, error } = await db.query(
      `SELECT * FROM fn_citizenship();`,
      []
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getCitizenship: ", error.message);
>>>>>>> da1adc4818c7c1b2b4d8a755e22524c4f2dac49c
    return false;
  }
}

export default {
<<<<<<< HEAD
  getBrand,
  getModel,
  getCapacity,
  getBox,
  getPostType,
  getVehicleType,
  getMassType,
  getBucketType,
  getFuelType,
  getPowerType,
=======
  getCitizenship,
>>>>>>> da1adc4818c7c1b2b4d8a755e22524c4f2dac49c
};

import db from "../utils/db";

async function getVehicles() {
  try {
    const { rows, error } = await db.query(
      `SELECT DISTINCT(vehicle_name) FROM files;`,
      []
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getModel: ", error.message);
    return false;
  }
}

export default {
  getVehicles,
};

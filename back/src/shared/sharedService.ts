import db from "../utils/db";

async function getVehicles() {
  try {
    const { rows, error } = await db.query(
      `SELECT id, vehicle_name FROM vehicle ORDER BY id;`,
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

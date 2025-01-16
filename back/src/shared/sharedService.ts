import db from "../utils/db";

async function getCitizenship() {
  try {
    const { rows, error } = await db.query(
      `SELECT * FROM fn_citizenship();`,
      []
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getCitizenship: ", error.message);
    return false;
  }
}

export default {
  getCitizenship,
};

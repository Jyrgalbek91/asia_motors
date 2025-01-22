import { md5 } from "../utils/utils";
import db from "../utils/db";
import { ILogin } from "./types";

async function userLogin(login: ILogin, password: string) {
  try {
    const cryptoPass = md5(password);
    const { rows, rowCount } = await db.query(
      `SELECT * FROM public.fn_auth($1, $2);`,
      [login, cryptoPass]
    );

    if (rowCount && rowCount > 0) {
      const { id_user, roles, surname, name } = rows[0];
      return {
        id: id_user,
        role: roles,
        surname,
        name,
      };
    }
    return false;
  } catch (err) {
    console.log("error userLogin: ", err.message);
    return false;
  }
}

async function saveRecourse(
  name: string,
  phone: string,
  auto: string,
  release: string,
  mileage: string,
  recourse: string
) {
  try {
    const { error, rows } = await db.query(
      `INSERT INTO service(name, phone, auto, release, mileage, recourse)
       VALUES($1, $2, $3, $4, $5, $6)
       RETURNING id_service;`,
      [name, phone, auto, release, mileage, recourse]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error saveRecourse: ", error.message);
    return false;
  }
}

async function getAllResourse(page: number, offset: number) {
  try {
    const limit = offset;
    const offsetValue = (page - 1) * offset;
    const { error, rows } = await db.query(
      `SELECT * FROM service LIMIT $1 OFFSET $2;`,
      [limit, offsetValue]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getAllResourse: ", error.message);
    return false;
  }
}

async function getResourseById(id_service: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT * FROM service WHERE id_service = $1;`,
      [id_service]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error getResourseById: ", error.message);
    return false;
  }
}

async function markAsRead(id_service: number) {
  try {
    const { error, rows } = await db.query(
      `UPDATE service
       SET active = false, date = CURRENT_TIMESTAMP
       WHERE id_service = $1
       RETURNING *;`,
      [id_service]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error markAsRead: ", error.message);
    return false;
  }
}

async function saveFeedback(
  name: string,
  phone: string,
  id_brand: number,
  id_model: number,
  wording: string
) {
  try {
    const { error, rows } = await db.query(
      `INSERT INTO feedback(name, phone, id_brand, id_model, wording)
       VALUES($1, $2, $3, $4, $5)
       RETURNING id_feedback;`,
      [name, phone, id_brand, id_model, wording]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error saveFeedback: ", error.message);
    return false;
  }
}

async function getAllFeedback(page: number, offset: number) {
  try {
    const limit = offset;
    const offsetValue = (page - 1) * offset;
    const { error, rows } = await db.query(
      `SELECT f.id_feedback, 
              f."name", 
              f.phone, 
              f.id_brand,
              b.brand_name,
              f.id_model,
              m.model_name,
              f.wording,
              f"date",
              f.active
       FROM feedback f 
       LEFT JOIN brand b USING(id_brand)
       LEFT JOIN model m USING(id_model)
       LIMIT $1 OFFSET $2;`,
      [limit, offsetValue]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getAllFeedback: ", error.message);
    return false;
  }
}

async function getFeedbackById(id_feedback: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT f.id_feedback, 
              f."name", 
              f.phone, 
              f.id_brand,
              b.brand_name,
              f.id_model,
              m.model_name,
              f.wording,
              f"date",
              f.active
       FROM feedback f 
       LEFT JOIN brand b USING(id_brand)
       LEFT JOIN model m USING(id_model)
       WHERE id_feedback = $1;`,
      [id_feedback]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error getFeedbackById: ", error.message);
    return false;
  }
}

const UserService = {
  userLogin,
  saveRecourse,
  getAllResourse,
  getResourseById,
  markAsRead,
  saveFeedback,
  getAllFeedback,
  getFeedbackById,
};

export default UserService;

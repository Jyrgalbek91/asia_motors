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

const UserService = {
  userLogin,
};

export default UserService;

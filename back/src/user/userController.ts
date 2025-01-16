import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/send";
import validate from "../utils/validate";
import Config from "../utils/config";
import TokenService from "../utils/jwt";
import { IRequestBodyLogin, IUser } from "./types";
import UserService from "./userService";
import UserSchema from "./userSchema";

class UserController {
  async login(req: Request, res: Response) {
    try {
      const isValid = validate(req.body, UserSchema.loginSchema);
      if (!isValid) return sendError(res, req.t("inValidFormat"));

      const { login, password } = req.body as IRequestBodyLogin;

      const user: IUser | false = await UserService.userLogin(login, password);

      if (user && user.id) {
        const exp =
          Date.now() + parseInt(Config.JWT_EXPIRE_HOURS) * 60 * 60 * 1000;

        const role = Array.isArray(user.role) ? user.role : [user.role];

        const token = TokenService.generateAccessToken({
          id: user.id,
          r: role,
          s: user.surname,
          n: user.name,
          exp,
        });
        if (!token) return sendError(res, req.t("token.generateError"));

        if (user) {
          return sendSuccess(res, req.t("success"), {
            id: user.id,
            r: role,
            s: user.surname,
            n: user.name,
            exp: exp,
            token,
            tokenType: "Bearer",
            expiresIn: parseInt(Config.JWT_EXPIRE_HOURS) * 60,
          });
        }
      }
      return sendError(res, req.t("unauth"), false, 401);
    } catch (error) {
      console.log("error login: ", error.message);
      return sendError(res, req.t("error"), false, 400);
    }
  }
}

export default new UserController();

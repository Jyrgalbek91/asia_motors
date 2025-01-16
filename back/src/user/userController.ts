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
  async recourse(req: Request, res: Response) {
    try {
      const { name, phone, auto, release, mileage, recourse } = req.body;
      const data = await UserService.saveRecourse(
        name,
        phone,
        auto,
        release,
        mileage,
        recourse
      );
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(400).json({ message: "Ошибка" });
    } catch (error) {
      console.log("error recourse: ", error.message);
      return false;
    }
  }

  async getAllResourseController(req: Request, res: Response) {
    try {
      const { page = 1, offset = 10 } = req.query;
      const pageNumber = Number(page);
      const offsetNumber = Number(offset);
      const data = await UserService.getAllResourse(pageNumber, offsetNumber);
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(400).json({ message: "Ошибка" });
    } catch (error) {
      console.log("error getAllResourseController: ", error.message);
      return false;
    }
  }

  async getResourseByIdController(req: Request, res: Response) {
    try {
      const { id_service } = req.query;
      const data = await UserService.getResourseById(Number(id_service));
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(400).json({ message: "Ошибка" });
    } catch (error) {
      console.log("error getResourseByIdController: ", error.message);
      return false;
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const updatedData = await UserService.markAsRead(Number(id));
      console.log(updatedData);

      return updatedData
        ? res.status(200).json({
            message: "Помечено как прочитанное",
            data: updatedData,
          })
        : res.status(404).json({ message: "Запись не найдена" });
    } catch (error) {
      console.error("Error in markAsRead: ", error.message);
      return res.status(500).json({ message: "Ошибка при обновлении записи" });
    }
  }

  async feedback(req: Request, res: Response) {
    try {
      const { name, phone, id_brand, id_model, wording } = req.body;
      const data = await UserService.saveFeedback(
        name,
        phone,
        id_brand,
        id_model,
        wording
      );
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(400).json({ message: "Ошибка" });
    } catch (error) {
      console.log("error feedback: ", error.message);
      return false;
    }
  }

  async getAllFeedbackController(req: Request, res: Response) {
    try {
      const { page = 1, offset = 10 } = req.query;
      const pageNumber = Number(page);
      const offsetNumber = Number(offset);
      const data = await UserService.getAllFeedback(pageNumber, offsetNumber);
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(400).json({ message: "Ошибка" });
    } catch (error) {
      console.log("error getAllFeedbackController: ", error.message);
      return false;
    }
  }

  async getFeedbackIdController(req: Request, res: Response) {
    try {
      const { id_feedback } = req.query;
      const data = await UserService.getFeedbackById(Number(id_feedback));
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(400).json({ message: "Ошибка" });
    } catch (error) {
      console.log("error getFeedbackIdController: ", error.message);
      return false;
    }
  }
}

export default new UserController();

import { Request, Response } from "express";
import sharedService from "./sharedService";
import { sendError, sendSuccess } from "../utils/send";

class SharedController {
  async vehicleList(req: Request, res: Response) {
    try {
      const data = await sharedService.getVehicles();
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      return sendError(res, req.t("error"));
    }
  }
}

export default new SharedController();

import { Request, Response } from "express";
import sharedService from "./sharedService";
class SharedController {
  async vehicleList(_req: Request, res: Response) {
    try {
      const data = await sharedService.getVehicles();
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(404).json({ message: "Ошибка" });
    } catch (error) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}

export default new SharedController();

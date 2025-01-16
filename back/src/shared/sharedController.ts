import { Request, Response } from "express";
import sharedService from "./sharedService";

class SharedController {
  async getBrandController(req: Request, res: Response) {
    try {
      const { id_type } = req.query;
      const data = await sharedService.getBrand(Number(id_type));
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(404).json({ message: "Ошибка" });
    } catch (error) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getModelController(req: Request, res: Response) {
    try {
      const { id_brand } = req.query;
      const idBrand = Number(id_brand);
      const data = await sharedService.getModel(idBrand);
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(404).json({ message: "Ошибка" });
    } catch (error) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getCapacityController(_req: Request, res: Response) {
    try {
      const data = await sharedService.getCapacity();
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(404).json({ message: "Ошибка" });
    } catch (error) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getBoxController(_req: Request, res: Response) {
    try {
      const data = await sharedService.getBox();
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(404).json({ message: "Ошибка" });
    } catch (error) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getPostTypeController(_req: Request, res: Response) {
    try {
      const data = await sharedService.getPostType();
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(404).json({ message: "Ошибка" });
    } catch (error) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getVehicleTypeController(_req: Request, res: Response) {
    try {
      const data = await sharedService.getVehicleType();
      return data
        ? res.status(200).json({ message: "Успешно", data })
        : res.status(404).json({ message: "Ошибка" });
    } catch (error) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}

export default new SharedController();

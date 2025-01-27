import { Request, Response } from "express";
import carService from "./carService";
import FileService from "../services/FileService";
import Config from "../utils/config";
import validate from "../utils/validate";
import carSchema from "./carSchema";
import File from "../utils/file";

const FILE_CAR_IMAGES_PATH = Config.FILE_CAR_IMAGES_PATH;

class CarController {
  async createController(req: Request, res: Response) {
    try {
      const isValid = validate(req.body, carSchema.carSchema);
      if (!isValid) return res.status(400).json({ message: "Неверный формат" });

      const { id_vehicle, id_color, id_size, images } = req.body;

      const uploadedImages: string[] = [];

      if (req.files && req.files.images) {
        const imagesArray = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];

        for (const file of imagesArray) {
          const result = await FileService.saveFile({
            path: FILE_CAR_IMAGES_PATH,
            fileName: file.name,
            sampleFile: file,
            type: "image",
          });

          if (result.error) {
            return res.status(400).json({ message: "Ошибка загрузки файла" });
          }

          uploadedImages.push(result.dbFileName);
        }
      }

      const result = await carService.createCarImage(
        Number(id_vehicle),
        Number(id_color),
        Number(id_size),
        uploadedImages.length > 0 ? uploadedImages : images
      );

      if (!result) {
        return res.status(404).json({ message: "Ошибка создания поста" });
      }

      return res.status(200).json({ message: "Пост успешно создан", result });
    } catch (error) {
      console.error("Ошибка в createController: ", error.message);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getCarImageController(req: Request, res: Response) {
    try {
      const { id_vehicle, id_color, id_size } = req.query;
      const idVehicle = Number(id_vehicle);
      const idColor = Number(id_color);
      const idSize = Number(id_size);

      const result = await carService.getCarImages(idVehicle, idColor, idSize);
      console.log(result);
            

      if (!result) {
        return res.status(404).json({ message: "Фотографии не найдены" });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("error getCarImageController: ", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async showImage(req: Request, res: Response) {
    try {
      const fileName = req.params.fileName;
      const path = FILE_CAR_IMAGES_PATH + fileName;
      const existFile = await File.exists(path);
      console.log(await File.exists(path));
      if (existFile) return res.sendFile(path);
      else return res.status(400).json({ message: "Файл не найден" });
    } catch (error) {
      console.log("error showFile: ", error.message);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async deleteCar(req: Request, res: Response) {
    const { id_car } = req.params;

    if (isNaN(Number(id_car))) {
      return res.status(400).json({ message: "Неверный формат ID" });
    }

    const result = await carService.deleteCarById(Number(id_car));

    if (result) {
      return res.status(200).json({ message: "Успешно удалено" });
    } else {
      return res.status(500).json({ message: "Ошибка при удалении" });
    }
  }
}

export default new CarController();

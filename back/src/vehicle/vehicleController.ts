import { Request, Response } from "express";
import FileService from "../services/FileService";
import Config from "../utils/config";
import VehicleService from "./vehicleService";
import File from "../utils/file";

const FILE_VEHICLE_PATH = Config.FILE_VEHICLE_PATH;
const PDF_FILE_PATH = Config.PDF_FILE_PATH;

class VehicleController {
  async createPdfFileController(req: Request, res: Response) {
    try {
      const { id_vehicle } = req.body;
      if (!id_vehicle) {
        return res
          .status(400)
          .json({ message: "ID транспортного средства отсутствует" });
      }

      let uploadedImage: string | null = null;

      if (req.files?.images) {
        const imageFile = Array.isArray(req.files.images)
          ? req.files.images[0]
          : req.files.images;

        const result = await FileService.saveFile({
          path: FILE_VEHICLE_PATH,
          fileName: imageFile.name,
          sampleFile: imageFile,
          type: "image",
        });

        if (result.error) {
          return res
            .status(400)
            .json({ message: "Ошибка загрузки изображения" });
        }

        uploadedImage = result.dbFileName;
      }

      const pdfFile = req.files?.file_name;
      if (!pdfFile) {
        return res.status(400).json({ message: "Файл PDF отсутствует" });
      }

      const pdfFileName = Array.isArray(pdfFile)
        ? pdfFile[0].name
        : pdfFile.name;

      const { dbFileName, error } = await FileService.saveFile({
        path: PDF_FILE_PATH,
        fileName: pdfFileName,
        sampleFile: Array.isArray(pdfFile) ? pdfFile[0] : pdfFile,
        type: "file",
        allowTypePrefix: false,
      });

      if (error) {
        return res.status(400).json({ message: "Ошибка сохранения PDF-файла" });
      }

      if (uploadedImage) {
        const resultImage = await VehicleService.createImageFile(
          id_vehicle,
          uploadedImage
        );
        if (!resultImage) {
          return res
            .status(400)
            .json({ message: "Ошибка сохранения изображения в БД" });
        }
      }

      const resultFile = await VehicleService.createPdfFile(
        id_vehicle,
        dbFileName
      );
      if (!resultFile) {
        return res
          .status(400)
          .json({ message: "Ошибка сохранения PDF-файла в БД" });
      }

      return res.status(200).json({ message: "Файлы успешно загружены" });
    } catch (error) {
      console.error("Ошибка в createPdfFileController: ", error);
      return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }

  async updateVehicleFilesController(req: Request, res: Response) {
    try {
      const { id_vehicle } = req.body;
      if (!id_vehicle) {
        return res
          .status(400)
          .json({ message: "ID транспортного средства отсутствует" });
      }

      let newImage: string | null = null;
      let newPdfFile: string | null = null;

      if (req.files?.images) {
        const imageFile = Array.isArray(req.files.images)
          ? req.files.images[0]
          : req.files.images;
        const result = await FileService.saveFile({
          path: FILE_VEHICLE_PATH,
          fileName: imageFile.name,
          sampleFile: imageFile,
          type: "image",
        });

        if (result.error) {
          return res
            .status(400)
            .json({ message: "Ошибка загрузки изображения" });
        }
        newImage = result.dbFileName;
      }

      if (req.files?.file_name) {
        const pdfFile = Array.isArray(req.files.file_name)
          ? req.files.file_name[0]
          : req.files.file_name;
        const result = await FileService.saveFile({
          path: PDF_FILE_PATH,
          fileName: pdfFile.name,
          sampleFile: pdfFile,
          type: "file",
          allowTypePrefix: false,
        });

        if (result.error) {
          return res.status(400).json({ message: "Ошибка загрузки PDF-файла" });
        }
        newPdfFile = result.dbFileName;
      }

      const updateResult = await VehicleService.updateVehicleFiles(
        id_vehicle,
        newPdfFile,
        newImage
      );
      if (!updateResult) {
        return res
          .status(400)
          .json({ message: "Ошибка обновления файлов в БД" });
      }

      return res.status(200).json({ message: "Файлы успешно обновлены" });
    } catch (error) {
      console.error("Ошибка в updateVehicleFilesController: ", error);
      return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }

  async getVehicleDataController(req: Request, res: Response) {
    try {
      const { id_vehicle } = req.params;
      if (!id_vehicle) {
        return res
          .status(400)
          .json({ message: "ID транспортного средства отсутствует" });
      }
      const result = await VehicleService.getVehicleData(Number(id_vehicle));
      return result
        ? res.status(200).json({ message: "Успешно", result })
        : res.status(400).json({ message: "Ошибка при получениие данных" });
    } catch (error) {
      console.log("error getVehicleDataController: ", error.message);
      return false;
    }
  }

  async showImage(req: Request, res: Response) {
    try {
      const fileName = req.params.fileName;
      const path = FILE_VEHICLE_PATH + fileName;
      const existFile = await File.exists(path);
      console.log(await File.exists(path));
      if (existFile) return res.sendFile(path);
      else return res.status(400).json({ message: "Файл не найден" });
    } catch (error) {
      console.log("error showFile: ", error.message);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async deletePdfFileController(req: Request, res: Response) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ message: "Неверный формат ID" });
    }

    const result = await VehicleService.deleteFileById(Number(id));

    if (result) {
      return res.status(200).json({ message: "Успешно удалено" });
    } else {
      return res.status(500).json({ message: "Ошибка при удалении" });
    }
  }
}

export default new VehicleController();

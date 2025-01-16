import { Request, Response } from "express";
import validate from "../utils/validate";
import FileService from "../services/FileService";
import Config from "../utils/config";
import vehicleSchema from "./vehicleSchema";
import VehicleService from "./vehicleService";
import File from "../utils/file";

const FILE_VEHICLE_PATH = Config.FILE_VEHICLE_PATH;
const PDF_FILE_PATH = Config.PDF_FILE_PATH;
// const PDF_FILE_URL = Config.PDF_FILE_URL;

class VehicleController {
  async createVehicleController(req: Request, res: Response) {
    try {
      const isValid = validate(req.body, vehicleSchema.vehicleSchema);
      if (!isValid) return res.status(400).json({ message: "Неверный формат" });

      const {
        id_type,
        id_brand,
        id_model,
        id_capacity,
        id_box,
        description,
        images,
        id_mass,
        id_bucket,
      } = req.body;

      const id_capacityValue = id_capacity === "" ? null : id_capacity;
      const id_boxValue = id_box === "" ? null : id_box;
      const id_massValue = id_mass === "" ? null : id_mass;
      const id_bucketValue = id_bucket === "" ? null : id_bucket;

      const idUser = Number(req.user?.id);
      if (!idUser) {
        return res.status(404).json({ message: "У вас нет доступа" });
      }

      const uploadedImages: string[] = [];

      if (req.files && req.files.images) {
        const imagesArray = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];

        for (const file of imagesArray) {
          const result = await FileService.saveFile({
            path: FILE_VEHICLE_PATH,
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

      const pdfFile = req.files?.pdf_file;
      if (!pdfFile)
        return res.status(400).json({ message: "Файл отсутствует" });

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
      if (error)
        return res.status(400).json({ message: "Не удалось сохранить файл" });

      const result = await VehicleService.create(
        id_type,
        id_brand,
        id_model,
        id_capacityValue,
        id_boxValue,
        description,
        uploadedImages.length > 0 ? uploadedImages : images,
        dbFileName,
        id_massValue,
        id_bucketValue
      );

      if (!result) {
        return res
          .status(404)
          .json({ message: "Ошибка создания транспортных средств" });
      }

      return res.status(200).json({ message: "Успешно создано", result });
    } catch (error) {
      console.error("Ошибка в createController: ", error.message);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getVehicleByIdController(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const idVehicle = Number(id);
      const result = await VehicleService.getVehicleById(idVehicle);
      if (!result)
        return res
          .status(404)
          .json({ message: "Транспортные средства не найдены" });
      return res.status(200).json(result);
    } catch (error) {
      console.error("error getNewsController: ", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getAllVehicleController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        page = 1,
        offset = 12,
        id_brand,
        id_model,
        id_capacity,
        id_box,
        id_mass,
        id_bucket
      } = req.query;

      const idType = Number(id);
      const pageNumber = Number(page);
      const offsetNumber = Number(offset);

      if (isNaN(pageNumber) || isNaN(offsetNumber)) {
        return res.status(400).json({ message: "Некорректные параметры" });
      }

      const filters: any = {};
      if (id_brand) filters.id_brand = Number(id_brand);
      if (id_model) filters.id_model = Number(id_model);
      if (id_capacity) filters.id_capacity = Number(id_capacity);
      if (id_box) filters.id_box = Number(id_box);
      if (id_mass) filters.id_mass = Number(id_mass);
      if (id_bucket) filters.id_bucket = Number(id_bucket);

      const result = await VehicleService.getAllVehicles(
        idType,
        pageNumber,
        offsetNumber,
        filters
      );

      if (!result) {
        return res.status(404).json({
          message: `Транспортные средства не найдены`,
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("error getAllVehicleController: ", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async showFile(req: Request, res: Response) {
    try {
      const fileName = req.params.fileName;
      const path = PDF_FILE_PATH + fileName;
      const existFile = await File.exists(path);
      console.log(await File.exists(path));
      if (existFile) return res.sendFile(path);
      else return res.status(400).json({ message: "Файл не найден" });
    } catch (error) {
      console.log("error showFile: ", error.message);
      return res.status(500).json({ message: "Ошибка сервера" });
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

  async deleteVehicle(req: Request, res: Response) {
    const { id_vehicle } = req.params;

    if (isNaN(Number(id_vehicle))) {
      return res.status(400).json({ message: "Неверный формат ID" });
    }

    const result = await VehicleService.deleteVehicleById(Number(id_vehicle));

    if (result) {
      return res.status(200).json({ message: "Успешно удалено" });
    } else {
      return res.status(500).json({ message: "Ошибка при удалении" });
    }
  }

  async updateVehicle(req: Request, res: Response) {
    try {
      const { id_vehicle } = req.params;
      const data = req.body;

      if (isNaN(Number(id_vehicle))) {
        return res.status(400).json({ message: "Неверный формат ID" });
      }

      if (typeof data.images_to_delete === "string") {
        data.images_to_delete = data.images_to_delete
          .split(",")
          .map((id: string) => Number(id.trim()))
          .filter((id: number) => !isNaN(id));
      }

      const uploadedImages: string[] = [];

      if (req.files && req.files.images) {
        const imagesArray = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];

        for (const file of imagesArray) {
          const result = await FileService.saveFile({
            path: FILE_VEHICLE_PATH,
            fileName: file.name,
            sampleFile: file,
            type: "image",
          });

          if (result.error) {
            return res
              .status(400)
              .json({ message: "Ошибка загрузки изображения" });
          }

          uploadedImages.push(result.dbFileName);
        }
      }

      let newPdfFileName: string | null = null;
      const pdfFile = req.files?.pdf_file;

      if (pdfFile) {
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
          return res
            .status(400)
            .json({ message: "Ошибка обновления PDF-файла" });
        }

        newPdfFileName = dbFileName;
      }

      data.images = uploadedImages.map((imageName) => ({
        image_name: imageName,
      }));

      if (newPdfFileName) {
        data.pdf_file = newPdfFileName;
      }

      const numericFields = [
        "id_type",
        "id_brand",
        "id_model",
        "id_capacity",
        "id_box",
        "id_mass",
        "id_bucket",
      ];
      numericFields.forEach((field) => {
        if (data[field] === "" || data[field] === undefined) {
          data[field] = null;
        } else {
          data[field] = Number(data[field]);
          if (isNaN(data[field])) {
            data[field] = null;
          }
        }
      });

      const result = await VehicleService.updateVehicleById(
        Number(id_vehicle),
        data
      );

      if (result) {
        return res.status(200).json({ message: "Успешно обновлено" });
      } else {
        return res.status(500).json({ message: "Ошибка обновления" });
      }
    } catch (error) {
      console.error("Error in updateVehicle:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const {
        id_type,
        id_brand,
        id_model,
        id_capacity,
        id_box,
        description,
        id_mass,
        id_bucket,
        id_fuel,
        id_power
      } = req.body;

      const id_capacityValue = id_capacity === "" ? null : id_capacity;
      const id_boxValue = id_box === "" ? null : id_box;
      const id_massValue = id_mass === "" ? null : id_mass;
      const id_bucketValue = id_bucket === "" ? null : id_bucket;
      const id_fuelValue = id_fuel === "" ? null : id_fuel;
      const id_powerValue = id_power === "" ? null : id_power;

      const idUser = Number(req.user?.id);
      if (!idUser) {
        return res.status(404).json({ message: "У вас нет доступа" });
      }

      const result = await VehicleService.saveVehicle(
        id_type,
        id_brand,
        id_model,
        id_capacityValue,
        id_boxValue,
        description,
        id_massValue,
        id_bucketValue,
        id_fuelValue,
        id_powerValue
      );

      if (!result) {
        return res
          .status(404)
          .json({ message: "Ошибка создания транспортных средств" });
      }

      return res.status(200).json({ message: "Успешно создано", result });
    } catch (error) {
      console.error("Ошибка в saveVehicleController: ", error.message);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id_vehicle } = req.params;
      const data = req.body;

      if (isNaN(Number(id_vehicle))) {
        return res.status(400).json({ message: "Неверный формат ID" });
      }

      if (typeof data.images_to_delete === "string") {
        data.images_to_delete = data.images_to_delete
          .split(",")
          .map((id: string) => Number(id.trim()))
          .filter((id: number) => !isNaN(id));
      }

      const uploadedImages: string[] = [];

      if (req.files && req.files.images) {
        const imagesArray = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];

        for (const file of imagesArray) {
          const result = await FileService.saveFile({
            path: FILE_VEHICLE_PATH,
            fileName: file.name,
            sampleFile: file,
            type: "image",
          });

          if (result.error) {
            return res
              .status(400)
              .json({ message: "Ошибка загрузки изображения" });
          }

          uploadedImages.push(result.dbFileName);
        }
      }

      let newPdfFileName: string | null = null;
      const pdfFile = req.files?.pdf_file;

      if (pdfFile) {
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
          return res
            .status(400)
            .json({ message: "Ошибка обновления PDF-файла" });
        }

        newPdfFileName = dbFileName;
      }

      data.images = uploadedImages.map((imageName) => ({
        image_name: imageName,
      }));

      if (newPdfFileName) {
        data.pdf_file = newPdfFileName;
      }

      const numericFields = [
        "id_type",
        "id_brand",
        "id_model",
        "id_capacity",
        "id_box",
        "id_mass",
        "id_bucket",
      ];
      numericFields.forEach((field) => {
        if (data[field] === "" || data[field] === undefined) {
          data[field] = null;
        } else {
          data[field] = Number(data[field]);
          if (isNaN(data[field])) {
            data[field] = null;
          }
        }
      });

      const result = await VehicleService.updateVehicleById(
        Number(id_vehicle),
        data
      );

      if (result) {
        return res.status(200).json({ message: "Успешно обновлено" });
      } else {
        return res.status(500).json({ message: "Ошибка обновления" });
      }
    } catch (error) {
      console.error("Error in updateVehicle:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

}

export default new VehicleController();

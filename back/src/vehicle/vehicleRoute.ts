import express from "express";
import CheckService from "../services/CheckService";
import VehicleController from "./vehicleController";

const router = express.Router();

// router.post(
//   "/create",
//   CheckService.isAdminToken,
//   VehicleController.createController
// );
router.post("/create", CheckService.isAdminToken, VehicleController.create);
router.get("/get/id", VehicleController.getVehicleByIdController);
router.get("/get/:id", VehicleController.getAllVehicleController);
router.get("/pdf_file/show/:fileName", VehicleController.showFile);
router.get("/image_file/show/:fileName", VehicleController.showImage);
router.delete("/delete/:id_vehicle", VehicleController.deleteVehicle);
router.put("/update/:id_vehicle", VehicleController.update);
router.post("/add/images/:id", VehicleController.addImageController);
router.post("/add/file/:id", VehicleController.addFileController);
router.delete("/delete/image/:id_image", VehicleController.deleteImage);
router.delete("/delete/file/:id_vehicle", VehicleController.deleteFile);

export default router;

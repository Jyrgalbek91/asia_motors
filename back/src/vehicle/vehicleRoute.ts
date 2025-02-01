import express from "express";
import VehicleController from "./vehicleController";

const router = express.Router();

router.post("/save", VehicleController.createPdfFileController);
router.get("/info/:id_vehicle", VehicleController.getVehicleDataController);
router.put("/update-files", VehicleController.updateVehicleFilesController);
router.get("/image_file/show/:fileName", VehicleController.showImage);
router.delete("/delete/:id", VehicleController.deletePdfFileController);

export default router;

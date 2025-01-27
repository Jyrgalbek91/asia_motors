import express from "express";
import CarController from "./carController";

const router = express.Router();

router.post("/create/images", CarController.createController);
router.get("/get", CarController.getCarImageController);
router.get("/car_images/show/:fileName", CarController.showImage);
router.delete("/delete/:id_car", CarController.deleteCar);

export default router;

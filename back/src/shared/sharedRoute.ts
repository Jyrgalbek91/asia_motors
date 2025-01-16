import express from "express";
import SharedController from "./sharedController";

const router = express.Router();

router.get("/brand", SharedController.getBrandController);
router.get("/model", SharedController.getModelController);
router.get("/capacity", SharedController.getCapacityController);
router.get("/box", SharedController.getBoxController);
router.get("/post-type", SharedController.getPostTypeController);
router.get("/vehicle-type", SharedController.getVehicleTypeController);
router.get("/exp-mass", SharedController.getMassController);
router.get("/bucket-volume", SharedController.getMassController);
router.get("/fuel", SharedController.getFuelController);
router.get("/power", SharedController.getPowerController);

export default router;

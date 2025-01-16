import express from "express";
import SharedController from "./sharedController";

const router = express.Router();

<<<<<<< HEAD
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
=======
router.get("/citizenship", SharedController.citizenshipList);
>>>>>>> da1adc4818c7c1b2b4d8a755e22524c4f2dac49c

export default router;

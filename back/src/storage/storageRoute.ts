import express from "express";
import StorageController from "./storageController";

const router = express.Router();

router.post("/save", StorageController.saveFilesController);
router.post("/save/info", StorageController.saveInfoFilesController);
router.get("/file", StorageController.getFilesController);
router.get("/file/info", StorageController.getInfoFilesController);
router.get("/pdf_file/show/:fileName", StorageController.showFile);
router.put("/update/:id_file", StorageController.updateFilesController);
router.delete("/delete/:id_file", StorageController.deleteStorageController);
// router.delete("/delete/:id_file", StorageController.deleteInfoStorageController);

export default router;

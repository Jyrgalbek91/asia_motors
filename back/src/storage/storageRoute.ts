import express from "express";
import StorageController from "./storageController";

const router = express.Router();

router.post("/save", StorageController.saveFilesController);
router.get("/file", StorageController.getFilesController);
router.get("/pdf_file/show/:fileName", StorageController.showFile);
router.put("/update/:id_file", StorageController.updateFilesController);
router.delete("/delete/:id_file", StorageController.deleteStorageController);

export default router;

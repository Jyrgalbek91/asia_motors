import express from "express";
import SharedController from "./sharedController";

const router = express.Router();

router.get("/citizenship", SharedController.citizenshipList);

export default router;

import express from "express";
import UserController from "./userController";

const router = express.Router();

router.post("/login", UserController.login);

export default router;

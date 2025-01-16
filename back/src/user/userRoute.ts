import express from "express";
import UserController from "./userController";

const router = express.Router();

router.post("/login", UserController.login);
router.post("/recourse", UserController.recourse);
router.get("/recourse/list", UserController.getAllResourseController);
router.get("/recourse/id", UserController.getResourseByIdController);
router.patch("/recourse/read/:id", UserController.markAsRead);
router.post("/feedback", UserController.feedback);
router.get("/feedback/list", UserController.getAllFeedbackController);
router.get("/feedback/id", UserController.getFeedbackIdController);

export default router;

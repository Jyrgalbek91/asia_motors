import express from "express";
import UserController from "./userController";

const router = express.Router();

router.post("/login", UserController.login);
<<<<<<< HEAD
router.post("/recourse", UserController.recourse);
router.get("/recourse/list", UserController.getAllResourseController);
router.get("/recourse/id", UserController.getResourseByIdController);
router.patch("/recourse/read/:id", UserController.markAsRead);
router.post("/feedback", UserController.feedback);
router.get("/feedback/list", UserController.getAllFeedbackController);
router.get("/feedback/id", UserController.getFeedbackIdController);
=======
>>>>>>> da1adc4818c7c1b2b4d8a755e22524c4f2dac49c

export default router;

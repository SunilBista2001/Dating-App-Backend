import { Router } from "express";
import * as authCtrl from "../controllers/authController.js";
import * as userCtrl from "../controllers/userController.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post("/sign-up", upload.single("profilePic"), authCtrl.signUp);

router.post("/sign-in", authCtrl.login);

router.get("/me", authCtrl.protect, authCtrl.me, userCtrl.getUser);

router.get(
  "/profile-complete",
  authCtrl.protect,
  authCtrl.me,
  userCtrl.isProfileComplete
);

router.put("/update-me", authCtrl.protect, userCtrl.updateMe);

export default router;

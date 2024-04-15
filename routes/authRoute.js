import { Router } from "express";
import * as authCtrl from "../controllers/authController.js";
import * as userCtrl from "../controllers/userController.js";

const router = Router();

router.post("/sign-up", authCtrl.signUp);

router.post("/sign-in", authCtrl.login);

router.get("/me", authCtrl.protect, authCtrl.me, userCtrl.getUser);

router.get(
  "/profile-complete",
  authCtrl.protect,
  authCtrl.me,
  userCtrl.isProfileComplete
);

router.put("/update-me", authCtrl.protect, userCtrl.updateMe);

router.put("/update-avatar", authCtrl.protect, userCtrl.updateProfilePicture);

export default router;

import { Router } from "express";
import * as authCtrl from "../controllers/authController.js";
import * as userCtrl from "../controllers/userController.js";

const router = Router();

router.post("/sign-up", authCtrl.signUp);

router.post("/sign-in", authCtrl.login);

router.get("/me", authCtrl.protect, authCtrl.me, userCtrl.getUser);

export default router;

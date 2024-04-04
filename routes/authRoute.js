import { Router } from "express";
import * as authCtrl from "../controllers/authController.js";

const router = Router();

router.post("/sign-up", authCtrl.signUp);

router.post("/sign-in", authCtrl.login);

export default router;

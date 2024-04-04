import { Router } from "express";
import * as userCtrl from "../controllers/userController.js";
import { protect } from "../controllers/authController.js";

const router = Router();

router.get("/male", protect, userCtrl.getMaleUsers);

router.get("/female", protect, userCtrl.getFemaleUsers);

export default router;

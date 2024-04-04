import { Router } from "express";
import * as authCtrl from "../controllers/authController.js";
import * as messageCtrl from "../controllers/messageController.js";

const router = Router();

router.post("/:id", authCtrl.protect, messageCtrl.sendMessage);

router.get("/:id", authCtrl.protect, messageCtrl.getMessages);

export default router;

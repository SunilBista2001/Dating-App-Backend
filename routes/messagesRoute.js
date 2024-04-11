import { Router } from "express";
import * as authCtrl from "../controllers/authController.js";
import * as messageCtrl from "../controllers/messageController.js";

const router = Router();

router.get("/:id", authCtrl.protect, messageCtrl.getMessages);

router.post("/:id", authCtrl.protect, messageCtrl.sendMessage);

router.delete("/:id", authCtrl.protect, messageCtrl.deleteConversation);

router.put("/:id/seen", authCtrl.protect, messageCtrl.markAsSeen);

export default router;

import { Router } from "express";
import * as authCtrl from "../controllers/authController.js";

const router = Router();

router.get("/chat", authCtrl.protect, (req, res) => {
  res.send("Chat Route");
});

export default router;

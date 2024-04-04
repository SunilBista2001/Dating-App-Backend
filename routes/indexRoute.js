import { Router } from "express";
import authRouter from "./authRoute.js";
import chatRouter from "./chatRoute.js";
const router = Router();

// auth routes
router.use("/", authRouter);

// chat routes
router.use("/", chatRouter);

export default router;

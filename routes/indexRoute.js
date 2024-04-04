import { Router } from "express";
import authRouter from "./authRoute.js";
import messageRouter from "./messagesRoute.js";
import adminRouter from "./adminRoute.js";
import userRouter from "./userRoute.js";

const router = Router();

// admin routes
router.use("/admin", adminRouter);

// auth routes
router.use("/auth", authRouter);

// user routes
router.use("/users", userRouter);

// messages routes
router.use("/messages", messageRouter);

export default router;

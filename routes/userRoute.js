import { Router } from "express";
import * as userCtrl from "../controllers/userController.js";
import { protect } from "../controllers/authController.js";

const router = Router();

router.get("/male", protect, userCtrl.getMaleUsers);

router.get("/female", protect, userCtrl.getFemaleUsers);

router.get("/all", protect, userCtrl.getAllUsers);

router.get("/sidebar-users", protect, userCtrl.getSidebarUsers);

router.put("/:userId/like", protect, userCtrl.likeUser);

export default router;

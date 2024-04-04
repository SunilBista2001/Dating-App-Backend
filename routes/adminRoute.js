import { Router } from "express";
import * as authCtrl from "../controllers/authController.js";
import * as userCtrl from "../controllers/userController.js";

const router = Router();

router.put(
  "/approve/:id",
  authCtrl.protect,
  authCtrl.restrictTo("admin"),
  authCtrl.approveUser
);

router.get(
  "/",
  authCtrl.protect,
  authCtrl.restrictTo("admin"),
  userCtrl.expiredUsers
);

export default router;

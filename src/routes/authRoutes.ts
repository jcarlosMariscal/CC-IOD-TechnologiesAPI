import express from "express";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../controllers/authController";
import {
  validationChangePass,
  validationEmail,
  validationsLogin,
  validationsRegister,
} from "../middlewares/authMiddelewares";
import { errorMiddleware } from "../middlewares/errorMiddleware";
const router = express.Router();

router.post("/register", validationsRegister, register);
router.post("/login", validationsLogin, login);
router.put("/forgot-password", validationEmail, forgotPassword);
router.put("/reset-password/:token", validationChangePass, resetPassword);
router.use(errorMiddleware);

export default router;

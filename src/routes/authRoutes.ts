import express from "express";
import { login, register } from "../controllers/authController";
import {
  validationsLogin,
  validationsRegister,
} from "../middlewares/validationsAuth";
import { errorMiddleware } from "../middlewares/errorMiddleware";
const router = express.Router();

router.post("/register", validationsRegister, register);
router.post("/login", validationsLogin, login);
router.use(errorMiddleware);

export default router;

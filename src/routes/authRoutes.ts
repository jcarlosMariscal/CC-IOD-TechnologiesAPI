import express from "express";
import { login, register } from "../controllers/authController";
import {
  validationsLogin,
  validationsRegister,
} from "../middlewares/validationsAuth";
const router = express.Router();

router.post("/register", validationsRegister, register);
router.post("/login", validationsLogin, login);

export default router;

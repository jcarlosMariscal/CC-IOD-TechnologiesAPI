import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/usersController";
import { validationsRegister } from "../middlewares/validationsAuth";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllUsers);
router.post("/", validationsRegister, createUser);
router.get("/:id", getUserById);
router.put("/:id", validationsRegister, updateUser);
router.delete("/:id", deleteUser);
router.use(errorMiddleware);

export default router;

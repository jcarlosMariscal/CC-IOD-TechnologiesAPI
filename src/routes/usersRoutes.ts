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

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllUsers);
router.post("/", validationsRegister, createUser);
router.get("/:id", getUserById);
router.put("/:id", validationsRegister, updateUser);
router.delete("/:id", deleteUser);

export default router;

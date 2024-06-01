import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  changePassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateAdmin,
  updateUser,
} from "../controllers/usersController";
import {
  validationChangePass,
  validationsRegister,
  validationsUpdate,
  validationsUpdateAdmin,
} from "../middlewares/validationsAuth";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllUsers);
router.post("/", validationsRegister, createUser);
router.get("/:id", getUserById);
router.put("/:id", validationsUpdate, updateUser);
router.put("/update-admin/:id", validationsUpdateAdmin, updateAdmin);
router.put("/change-password/:id", validationChangePass, changePassword);
router.delete("/:id", deleteUser);
router.use(errorMiddleware);

export default router;

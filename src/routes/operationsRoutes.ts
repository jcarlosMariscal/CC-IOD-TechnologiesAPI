import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  createOperation,
  deleteOperation,
  getAllOperations,
  getOperationById,
  updateOperation,
} from "../controllers/operationController";
import { validationFiles } from "../middlewares/validationFiles";
import { uploadFiles } from "../middlewares/uploadFiles";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllOperations);
router.post("/", validationFiles, uploadFiles, createOperation);
router.get("/:id", getOperationById);
router.put("/:id", validationFiles, uploadFiles, updateOperation);
router.delete("/:id", deleteOperation);

export default router;

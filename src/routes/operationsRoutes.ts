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
import { validateUserExistence } from "../middlewares/validateUserExistence";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllOperations);
router.post(
  "/:id",
  validateUserExistence,
  uploadFiles,
  createOperation,
  validationFiles
);
router.get("/:id", getOperationById);
router.put(
  "/:id",
  validateUserExistence,
  uploadFiles,
  updateOperation,
  validationFiles
);
router.delete("/:id", deleteOperation);

export default router;

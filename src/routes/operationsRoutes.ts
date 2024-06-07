import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  deleteFile,
  getAllOperations,
  getOperationById,
  updateOperation,
} from "../controllers/operationController";
import { validationFiles } from "../middlewares/validationFiles";
import { validateUserExistence } from "../middlewares/validateUserExistence";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { uploadReportFile } from "../middlewares/uploadFiles";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllOperations);
router.get("/:id", getOperationById);
router.put(
  "/:id",
  validateUserExistence,
  uploadReportFile,
  updateOperation,
  validationFiles
);

router.put("/delete-file/:id", deleteFile);
router.use(errorMiddleware);

export default router;

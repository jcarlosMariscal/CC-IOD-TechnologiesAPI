import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  createCarrier,
  deleteCarrier,
  getAllCarriers,
  updateCarrier,
} from "../controllers/carriersController";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { validationsCarrier } from "../middlewares/validationMiddlewares";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllCarriers);
router.post("/", validationsCarrier, createCarrier);
router.put("/:id", validationsCarrier, updateCarrier);
router.delete("/:id", deleteCarrier);
router.use(errorMiddleware);

export default router;

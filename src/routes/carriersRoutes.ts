import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  createCarrier,
  deleteCarrier,
  getAllCarriers,
  getCarrierById,
  updateCarrier,
} from "../controllers/carriersController";
import { validationsCarrier } from "../middlewares/validationsCarrier";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllCarriers);
router.get("/:id", getCarrierById);
router.post("/", validationsCarrier, createCarrier);
router.put("/:id", validationsCarrier, updateCarrier);
router.delete("/:id", deleteCarrier);

export default router;

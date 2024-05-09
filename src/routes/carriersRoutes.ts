import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { getAllCarriers } from "../controllers/carriersController";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllCarriers);

export default router;

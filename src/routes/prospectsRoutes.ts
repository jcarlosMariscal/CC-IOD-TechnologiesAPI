import express from "express";
import { createProspect } from "../controllers/prospectController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.use(authenticateToken);
router.post("/", createProspect);

export default router;
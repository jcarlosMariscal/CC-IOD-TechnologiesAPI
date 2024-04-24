import express from "express";
import { createProspect } from "../controllers/prospectController";
import { authenticateToken } from "../middlewares/authenticateToken";
import { validateProspect } from "../middlewares/validationsProspects";

const router = express.Router();

router.use(authenticateToken);
router.post("/", validateProspect, createProspect);

export default router;
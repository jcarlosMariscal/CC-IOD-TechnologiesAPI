import express from "express";
import { createProspect, getAllProspects } from "../controllers/prospectController";
import { authenticateToken } from "../middlewares/authenticateToken";
import { validateProspect } from "../middlewares/validationsProspects";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllProspects);
router.post("/", validateProspect, createProspect);

export default router;
import express from "express";
import { createProspect, deleteProspect, getAllProspects, getProspectById, updateProspect } from "../controllers/prospectController";
import { authenticateToken } from "../middlewares/authenticateToken";
import { validateProspect } from "../middlewares/validationsProspects";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllProspects);
router.post("/", validateProspect, createProspect);
router.get("/:id", getProspectById);
router.put("/:id", validateProspect, updateProspect);
router.delete("/:id", deleteProspect);

export default router;
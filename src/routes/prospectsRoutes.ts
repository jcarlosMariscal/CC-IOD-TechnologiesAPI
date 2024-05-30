import express from "express";
import {
  createProspect,
  deleteProspect,
  getAllProspects,
  getApprovedProspectsWithoutClient,
  getProspectById,
  updateProspect,
} from "../controllers/prospectController";
import { authenticateToken } from "../middlewares/authenticateToken";
import { validationsProspect } from "../middlewares/validationsProspect";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllProspects);
router.get("/approved-without-client/", getApprovedProspectsWithoutClient);
router.post("/", validationsProspect, createProspect);
router.get("/:id", getProspectById);
router.put("/:id", validationsProspect, updateProspect);
router.delete("/:id", deleteProspect);
router.use(errorMiddleware);

export default router;

import express from "express";
import {
  createProspect,
  deleteProspect,
  getAllProspects,
  getApprovedProspectsWithoutClient,
  updateProspect,
} from "../controllers/prospectController";
import { authenticateToken } from "../middlewares/authenticateToken";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { validationsProspect } from "../middlewares/validationMiddlewares";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllProspects);
router.get("/approved-without-client/", getApprovedProspectsWithoutClient);
router.post("/", validationsProspect, createProspect);
router.put("/:id", validationsProspect, updateProspect);
router.delete("/:id", deleteProspect);
router.use(errorMiddleware);

export default router;

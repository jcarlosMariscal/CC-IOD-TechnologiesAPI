import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  createClient,
  deleteClient,
  getAllClients,
  getClientById,
  updateClient,
} from "../controllers/clientController";
import { validationsClient } from "../middlewares/validationsClient";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllClients);
router.post("/", validationsClient, createClient);
router.get("/:id", getClientById);
router.put("/:id", validationsClient, updateClient);
router.delete("/:id", deleteClient);

export default router;

import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { createClient, deleteClient, getAllClients, getClientById, updateClient } from "../controllers/clientController";
import { validateClient } from "../middlewares/validateClient";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllClients);
router.post("/", validateClient, createClient);
router.get("/:id", getClientById);
router.put("/:id", validateClient, updateClient);
router.delete("/:id", deleteClient);

export default router;
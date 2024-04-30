import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { createCLient } from "../controllers/clientController";
import { validateClient } from "../middlewares/validateCLient";

const router = express.Router();

router.use(authenticateToken);
// router.get("/", getAllClients);
router.post("/", validateClient, createCLient);
// router.get("/:id", getClientById);
// router.put("/:id", validateClient, updateCLient);
// router.delete("/:id", deleteCLient);

export default router;
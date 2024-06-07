import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  createClient,
  deleteClient,
  deleteContract,
  getAllClients,
  getApprovedClientsWithoutCarrier,
  getClientById,
  updateClient,
  uploadContract,
} from "../controllers/clientController";
import { validationsClient } from "../middlewares/validationsClient";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { validationFiles } from "../middlewares/validationFiles";
import { uploadContractFile } from "../middlewares/uploadFiles";

const router = express.Router();

router.use(authenticateToken);
router.get("/", getAllClients);
router.get("/approved-without-carrier/", getApprovedClientsWithoutCarrier);
router.post("/", validationsClient, createClient);
router.get("/:id", getClientById);
router.put("/:id", validationsClient, updateClient);
router.put(
  "/upload-contract/:id",
  uploadContractFile,
  uploadContract,
  validationFiles
);
router.delete("/:id", deleteClient);
router.put("/delete-contract/:id", deleteContract);
router.use(errorMiddleware);

export default router;

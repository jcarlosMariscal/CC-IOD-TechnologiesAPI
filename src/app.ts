import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes";
import prospectsRoutes from "./routes/prospectsRoutes";
import clientsRoutes from "./routes/clientsRoutes";
import carriersRoutes from "./routes/carriersRoutes";
import operationsRoutes from "./routes/operationsRoutes";
import usersRoutes from "./routes/usersRoutes";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());

app.use(cors());
// app.use(cors({
//   origin: 'https://cciod.mx/'
// }));

const uploadsPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// ------- Routes -----------
app.use("/auth", authRoutes);
app.use("/prospects", prospectsRoutes);
app.use("/clients", clientsRoutes);
app.use("/carriers", carriersRoutes);
app.use("/operations", operationsRoutes);
app.use("/users", usersRoutes);

export default app;

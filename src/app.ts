import  "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes";
import prospectsRoutes from "./routes/prospectsRoutes";
import clientsRoutes from "./routes/clientsRoutes";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());
// app.use(cors({
//   origin: 'https://cciod.mx/'
// }));

// ------- Routes -----------
app.use("/auth", authRoutes);
app.use("/prospects", prospectsRoutes);
app.use("/clients", clientsRoutes);

export default app;
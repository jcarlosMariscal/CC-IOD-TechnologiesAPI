import  "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());
// app.use(cors({
//   origin: 'https://cciod.mx/'
// }));

// ------- Routes -----------
app.use("/auth", authRoutes);

export default app;
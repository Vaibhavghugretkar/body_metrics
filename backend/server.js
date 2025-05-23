import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import measurementRoutes from "./routes/measurementRoutes.js";
import cameraRoutes from "./routes/cameraRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/camera", cameraRoutes);
app.use("/api/company", companyRoutes);

app.get("/", (req, res) => {
  res.send("Body Metrics API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import { uploadAndPredict } from "../controllers/cameraController.js";
import { uploadMiddleware } from "../utils/multer.js";

const router = express.Router();

router.post("/upload", uploadMiddleware, uploadAndPredict);

export default router;

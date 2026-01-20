import express from "express";
import multer from "multer";
import { HfInference } from "@huggingface/inference";
import Embedding from "../models/Embedding";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Import pdf-parse correctly for v2
const { PDFParse } = require("pdf-parse");

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

router.post(
    "/upload",
    authMiddleware,
    upload.single("cv"),
    async (req: AuthRequest, res) => {
        try {
            if (!req.file) return res.status(400).json({ message: "No file uploaded" });

            // 1️⃣ Extract text from PDF
            const parser = new PDFParse({ data: req.file.buffer });
            const result = await parser.getText();
            await parser.destroy();
            const text = result.text.trim();
            if (!text) return res.status(400).json({ message: "Empty CV content" });

            // 2️⃣ Hugging Face embedding
            const embeddingResponse = await hf.featureExtraction({
                model: "sentence-transformers/all-MiniLM-L6-v2",
                inputs: text,
            });

            // Flatten embedding if necessary
            const embeddingArray: number[] = Array.isArray(embeddingResponse[0])
                ? (embeddingResponse[0] as number[])
                : (embeddingResponse as number[]);

            // 3️⃣ Store in MongoDB
            await Embedding.create({
                userId: req.user.userId,
                type: "cv",
                text,
                embedding: embeddingArray,
            });

            res.json({ message: "CV processed successfully" });
        } catch (err) {
            console.error("CV processing error:", err);
            res.status(500).json({
                message: "CV processing failed",
                error: err instanceof Error ? err.message : err,
            });
        }
    }
);

export default router;

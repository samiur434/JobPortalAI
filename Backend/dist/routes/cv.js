"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const inference_1 = require("@huggingface/inference");
const Embedding_1 = __importDefault(require("../models/Embedding"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Import pdf-parse correctly for v2
const { PDFParse } = require("pdf-parse");
const hf = new inference_1.HfInference(process.env.HUGGINGFACE_API_KEY);
router.post("/upload", auth_1.authMiddleware, upload.single("cv"), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "No file uploaded" });
        // 1️⃣ Extract text from PDF
        const parser = new PDFParse({ data: req.file.buffer });
        const result = await parser.getText();
        await parser.destroy();
        const text = result.text.trim();
        if (!text)
            return res.status(400).json({ message: "Empty CV content" });
        // 2️⃣ Hugging Face embedding
        const embeddingResponse = await hf.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: text,
        });
        // Flatten embedding if necessary
        const embeddingArray = Array.isArray(embeddingResponse[0])
            ? embeddingResponse[0]
            : embeddingResponse;
        // 3️⃣ Store in MongoDB
        await Embedding_1.default.create({
            userId: req.user.userId,
            type: "cv",
            text,
            embedding: embeddingArray,
        });
        res.json({ message: "CV processed successfully" });
    }
    catch (err) {
        console.error("CV processing error:", err);
        res.status(500).json({
            message: "CV processing failed",
            error: err instanceof Error ? err.message : err,
        });
    }
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const EmbeddingSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    jobId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Job",
    },
    type: {
        type: String, // "cv" | "job"
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    embedding: {
        type: [Number],
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Embedding", EmbeddingSchema);

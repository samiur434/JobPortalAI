import mongoose from "mongoose";

const EmbeddingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
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
    },
    { timestamps: true }
);

export default mongoose.model("Embedding", EmbeddingSchema);

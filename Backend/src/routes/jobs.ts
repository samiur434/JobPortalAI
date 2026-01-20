import express from "express";
import { HfInference } from "@huggingface/inference";
import Job from "../models/Job";
import Embedding from "../models/Embedding";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

router.post("/post", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const {
            vacancy,
            age,
            location,
            salary,
            experience,
            published,
            employmentStatus,
            gender,
            jobLocation,
            requirements,
            responsibilities,
            companyInfo,
        } = req.body;

        // Create the job
        const newJob = new Job({
            employeeId: req.user.employeeId, // Assuming employee token
            vacancy,
            age,
            location,
            salary,
            experience,
            published,
            employmentStatus,
            gender,
            jobLocation,
            requirements,
            responsibilities,
            companyInfo,
        });

        const savedJob = await newJob.save();
        console.log("Job saved successfully with ID:", savedJob._id);

        // Generate embeddings for job matching
        const jobText = `${requirements} ${responsibilities} ${companyInfo}`.trim();
        console.log("Job text for embedding:", jobText.substring(0, 100) + "...");
        console.log("Job text length:", jobText.length);

        if (jobText && jobText.length > 10) {  // Ensure meaningful content
            try {
                console.log("Generating embeddings for job:", savedJob._id);
                const embeddingResponse = await hf.featureExtraction({
                    model: "sentence-transformers/all-MiniLM-L6-v2",
                    inputs: jobText,
                });

                console.log("Raw embedding response type:", typeof embeddingResponse);
                console.log("Raw embedding response:", Array.isArray(embeddingResponse) ? "Array" : "Not array");

                let embeddingArray: number[];

                if (Array.isArray(embeddingResponse)) {
                    if (Array.isArray(embeddingResponse[0]) && typeof embeddingResponse[0][0] === 'number') {
                        // Multiple embeddings, take first
                        embeddingArray = embeddingResponse[0] as number[];
                    } else if (typeof embeddingResponse[0] === 'number') {
                        // Single embedding
                        embeddingArray = embeddingResponse as number[];
                    } else {
                        throw new Error("Unexpected embedding response format");
                    }
                } else {
                    throw new Error("Embedding response is not an array");
                }

                console.log("Processed embedding array length:", embeddingArray.length);
                console.log("First 5 values:", embeddingArray.slice(0, 5));

                // Store job embeddings
                const embeddingDoc = await Embedding.create({
                    jobId: savedJob._id,
                    type: "job",
                    text: jobText,
                    embedding: embeddingArray,
                });

                console.log("Embedding stored successfully with ID:", embeddingDoc._id);
            } catch (embeddingError) {
                console.error("Error generating/storing embeddings:", embeddingError);
                console.error("Error details:", embeddingError instanceof Error ? embeddingError.message : embeddingError);
                // Don't fail the job creation if embeddings fail
            }
        } else {
            console.log("Job text is too short or empty, skipping embeddings. Length:", jobText.length);
        }

        res.status(201).json({ message: "Job posted successfully", jobId: savedJob._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get jobs posted by current employee
router.get("/my-jobs", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const jobs = await Job.find({ employeeId: req.user.employeeId }).sort({ createdAt: -1 });
        res.json({ jobs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
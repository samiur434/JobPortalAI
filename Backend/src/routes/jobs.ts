import express from "express";
import { HfInference } from "@huggingface/inference";
import Job from "../models/Job";
import Embedding from "../models/Embedding";
import AppliedJob from "../models/AppliedJob";
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
        const jobText = `
            Job Title: ${vacancy}
            Company: ${companyInfo}
            Location: ${location}
            Job Location: ${jobLocation}
            Salary: ${salary}
            Experience: ${experience}
            Employment Status: ${employmentStatus}
            Age Requirement: ${age}
            Gender: ${gender}
            Published: ${published}
            Requirements: ${requirements}
            Responsibilities: ${responsibilities}
        `.trim();
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

// Get all available jobs for users to apply
router.get("/all", async (req, res) => {
    try {
        console.log("Fetching all jobs...");
        const jobs = await Job.find().populate("employeeId", "companyInfo").sort({ createdAt: -1 });
        console.log("Found jobs:", jobs.length);
        res.json({ jobs });
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ message: "Server error", error: err instanceof Error ? err.message : "Unknown error" });
    }
});

// Apply for a job
router.post("/apply", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.userId;

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if already applied
        const existingApplication = await AppliedJob.findOne({ jobId, userId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        // Create application
        const application = new AppliedJob({
            jobId,
            userId,
            employeeId: job.employeeId,
            status: "pending",
        });

        await application.save();
        res.status(201).json({ message: "Application submitted successfully", applicationId: application._id });
    } catch (err) {
        console.error("Error applying for job:", err);
        res.status(500).json({ message: "Server error", error: err instanceof Error ? err.message : "Unknown error" });
    }
});

// Get applications for employee's jobs
router.get("/applications", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const employeeId = req.user.employeeId;

        // Get all jobs posted by this employee
        const employeeJobs = await Job.find({ employeeId });
        const jobIds = employeeJobs.map(job => job._id);

        // Get all applications for these jobs
        const applications = await AppliedJob.find({ jobId: { $in: jobIds } })
            .populate("jobId", "companyInfo vacancy salary jobLocation")
            .populate("userId", "firstName lastName email")
            .sort({ appliedAt: -1 });

        res.json({ applications });
    } catch (err) {
        console.error("Error fetching applications:", err);
        res.status(500).json({ message: "Server error", error: err instanceof Error ? err.message : "Unknown error" });
    }
});

// Check if user already applied for a job
router.get("/check-applied/:jobId", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.userId;

        const application = await AppliedJob.findOne({ jobId, userId });
        res.json({ hasApplied: !!application });
    } catch (err) {
        console.error("Error checking application status:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update application status
router.put("/application/:applicationId/status", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const employeeId = req.user.employeeId;

        if (!["pending", "reviewed", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Verify that the application belongs to one of the employee's jobs
        const application = await AppliedJob.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.employeeId.toString() !== employeeId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        application.status = status;
        await application.save();

        res.json({ message: "Application status updated", application });
    } catch (err) {
        console.error("Error updating application status:", err);
        res.status(500).json({ message: "Server error", error: err instanceof Error ? err.message : "Unknown error" });
    }
});

// Get application analysis (similarity score)
router.get("/application/:applicationId/analysis", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { applicationId } = req.params;
        const employeeId = req.user.employeeId;

        console.log(`Analyzing application: ${applicationId} for employee: ${employeeId}`);

        // 1. Fetch Application to get Job and User IDs
        const application = await AppliedJob.findById(applicationId)
            .populate("jobId", "companyInfo vacancy")
            .populate("userId", "firstName lastName email");

        if (!application) {
            console.log("Application not found");
            return res.status(404).json({ message: "Application not found" });
        }

        // Verify ownership (optional, but good practice)
        if (application.employeeId.toString() !== employeeId) {
            console.log("Unauthorized access to application");
            return res.status(403).json({ message: "Unauthorized" });
        }

        const jobId = application.jobId._id;
        const userId = application.userId._id;

        console.log(`Job ID: ${jobId}, User ID: ${userId}`);

        // 2. Fetch Embeddings
        const jobEmbedding = await Embedding.findOne({ jobId: jobId, type: "job" });
        const cvEmbedding = await Embedding.findOne({ userId: userId, type: "cv" });

        if (!jobEmbedding) {
            console.log("Job embedding not found");
        }
        if (!cvEmbedding) {
            console.log("CV embedding not found");
        }

        let similarityScore = 0;
        let jobText = jobEmbedding ? jobEmbedding.text : "Job details not available for comparison.";
        let userCvText = cvEmbedding ? cvEmbedding.text : "CV details not available for comparison.";

        // 3. Calculate Similarity
        if (jobEmbedding && cvEmbedding) {
            const { cosineSimilarity } = require("../utils/similarity");
            similarityScore = cosineSimilarity(jobEmbedding.embedding, cvEmbedding.embedding);
            console.log(`Calculated similarity score: ${similarityScore}`);
        }

        // Format score to percentage (0-100)
        const scorePercentage = Math.round(similarityScore * 100);

        res.json({
            similarityScore: scorePercentage,
            jobText,
            userCvText,
            applicantName: `${application.userId.firstName} ${application.userId.lastName}`,
            jobTitle: application.jobId.vacancy
        });

    } catch (err) {
        console.error("Error analyzing application:", err);
        res.status(500).json({ message: "Server error", error: err instanceof Error ? err.message : "Unknown error" });
    }
});

export default router;

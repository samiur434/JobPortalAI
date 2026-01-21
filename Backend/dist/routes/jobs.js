"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inference_1 = require("@huggingface/inference");
const Job_1 = __importDefault(require("../models/Job"));
const Embedding_1 = __importDefault(require("../models/Embedding"));
const AppliedJob_1 = __importDefault(require("../models/AppliedJob"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const hf = new inference_1.HfInference(process.env.HUGGINGFACE_API_KEY);
router.post("/post", auth_1.authMiddleware, async (req, res) => {
    try {
        const { vacancy, age, location, salary, experience, published, employmentStatus, gender, jobLocation, requirements, responsibilities, companyInfo, } = req.body;
        // Create the job
        const newJob = new Job_1.default({
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
        if (jobText && jobText.length > 10) { // Ensure meaningful content
            try {
                console.log("Generating embeddings for job:", savedJob._id);
                const embeddingResponse = await hf.featureExtraction({
                    model: "sentence-transformers/all-MiniLM-L6-v2",
                    inputs: jobText,
                });
                console.log("Raw embedding response type:", typeof embeddingResponse);
                console.log("Raw embedding response:", Array.isArray(embeddingResponse) ? "Array" : "Not array");
                let embeddingArray;
                if (Array.isArray(embeddingResponse)) {
                    if (Array.isArray(embeddingResponse[0]) && typeof embeddingResponse[0][0] === 'number') {
                        // Multiple embeddings, take first
                        embeddingArray = embeddingResponse[0];
                    }
                    else if (typeof embeddingResponse[0] === 'number') {
                        // Single embedding
                        embeddingArray = embeddingResponse;
                    }
                    else {
                        throw new Error("Unexpected embedding response format");
                    }
                }
                else {
                    throw new Error("Embedding response is not an array");
                }
                console.log("Processed embedding array length:", embeddingArray.length);
                console.log("First 5 values:", embeddingArray.slice(0, 5));
                // Store job embeddings
                const embeddingDoc = await Embedding_1.default.create({
                    jobId: savedJob._id,
                    type: "job",
                    text: jobText,
                    embedding: embeddingArray,
                });
                console.log("Embedding stored successfully with ID:", embeddingDoc._id);
            }
            catch (embeddingError) {
                console.error("Error generating/storing embeddings:", embeddingError);
                console.error("Error details:", embeddingError instanceof Error ? embeddingError.message : embeddingError);
                // Don't fail the job creation if embeddings fail
            }
        }
        else {
            console.log("Job text is too short or empty, skipping embeddings. Length:", jobText.length);
        }
        res.status(201).json({ message: "Job posted successfully", jobId: savedJob._id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Get jobs posted by current employee
router.get("/my-jobs", auth_1.authMiddleware, async (req, res) => {
    try {
        const jobs = await Job_1.default.find({ employeeId: req.user.employeeId }).sort({ createdAt: -1 });
        res.json({ jobs });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Get all available jobs for users to apply
router.get("/all", async (req, res) => {
    try {
        console.log("Fetching all jobs...");
        const jobs = await Job_1.default.find().populate("employeeId", "companyInfo").sort({ createdAt: -1 });
        console.log("Found jobs:", jobs.length);
        res.json({ jobs });
    }
    catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ message: "Server error", error: err instanceof Error ? err.message : "Unknown error" });
    }
});
// Apply for a job
router.post("/apply", auth_1.authMiddleware, async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.userId;
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        // Check if job exists
        const job = await Job_1.default.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        // Check if already applied
        const existingApplication = await AppliedJob_1.default.findOne({ jobId, userId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }
        // Create application
        const application = new AppliedJob_1.default({
            jobId,
            userId,
            employeeId: job.employeeId,
            status: "pending",
        });
        await application.save();
        res.status(201).json({ message: "Application submitted successfully", applicationId: application._id });
    }
    catch (err) {
        console.error("Error applying for job:", err);
        res.status(500).json({ message: "Server error", error: err instanceof Error ? err.message : "Unknown error" });
    }
});
// Get applications for employee's jobs
router.get("/applications", auth_1.authMiddleware, async (req, res) => {
    try {
        const employeeId = req.user.employeeId;
        // Get all jobs posted by this employee
        const employeeJobs = await Job_1.default.find({ employeeId });
        const jobIds = employeeJobs.map(job => job._id);
        // Get all applications for these jobs
        const applications = await AppliedJob_1.default.find({ jobId: { $in: jobIds } })
            .populate("jobId", "companyInfo vacancy salary jobLocation")
            .populate("userId", "firstName lastName email")
            .sort({ appliedAt: -1 });
        res.json({ applications });
    }
    catch (err) {
        console.error("Error fetching applications:", err);
        res.status(500).json({ message: "Server error", error: err instanceof Error ? err.message : "Unknown error" });
    }
});
// Check if user already applied for a job
router.get("/check-applied/:jobId", auth_1.authMiddleware, async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.userId;
        const application = await AppliedJob_1.default.findOne({ jobId, userId });
        res.json({ hasApplied: !!application });
    }
    catch (err) {
        console.error("Error checking application status:", err);
        res.status(500).json({ message: "Server error" });
    }
});
// Update application status
router.put("/application/:applicationId/status", auth_1.authMiddleware, async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const employeeId = req.user.employeeId;
        if (!["pending", "reviewed", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        // Verify that the application belongs to one of the employee's jobs
        const application = await AppliedJob_1.default.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        if (application.employeeId.toString() !== employeeId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        application.status = status;
        await application.save();
        res.json({ message: "Application status updated", application });
    }
    catch (err) {
        console.error("Error updating application status:", err);
        res.status(500).json({ message: "Server error", error: err instanceof Error ? err.message : "Unknown error" });
    }
});
exports.default = router;

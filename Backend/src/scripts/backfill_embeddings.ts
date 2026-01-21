
import mongoose from "mongoose";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";
import Job from "../models/Job";
import Embedding from "../models/Embedding";
import { connectDB } from "../config/db";

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

const generateEmbedding = async (text: string) => {
    try {
        const embeddingResponse = await hf.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: text,
        });

        if (Array.isArray(embeddingResponse)) {
            if (Array.isArray(embeddingResponse[0]) && typeof embeddingResponse[0][0] === 'number') {
                return embeddingResponse[0] as number[];
            } else if (typeof embeddingResponse[0] === 'number') {
                return embeddingResponse as number[];
            }
        }
        throw new Error("Unexpected embedding response format");
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
};

const backfillEmbeddings = async () => {
    await connectDB();

    try {
        const jobs = await Job.find({});
        console.log(`Found ${jobs.length} jobs to process.`);

        for (const job of jobs) {
            console.log(`Processing job ID: ${job._id}`);

            // Construct rich text for embedding
            const jobText = `
                Job Title: ${job.vacancy}
                Company: ${job.companyInfo}
                Location: ${job.location}
                Job Location: ${job.jobLocation}
                Salary: ${job.salary}
                Experience: ${job.experience}
                Employment Status: ${job.employmentStatus}
                Age Requirement: ${job.age}
                Gender: ${job.gender}
                Published: ${job.published}
                Requirements: ${job.requirements}
                Responsibilities: ${job.responsibilities}
            `.trim();

            if (!jobText || jobText.length < 10) {
                console.log(`Skipping job ${job._id}: Content too short.`);
                continue;
            }

            const embeddingArray = await generateEmbedding(jobText);

            if (embeddingArray) {
                // Remove existing embedding for this job if any
                await Embedding.deleteMany({ jobId: job._id });

                // Create new embedding
                await Embedding.create({
                    jobId: job._id,
                    type: "job",
                    text: jobText,
                    embedding: embeddingArray,
                });

                console.log(`Successfully updated embedding for job ${job._id}`);
            } else {
                console.log(`Failed to generate embedding for job ${job._id}`);
            }
        }

        console.log("Backfill completed.");
    } catch (error) {
        console.error("Error during backfill:", error);
    } finally {
        await mongoose.disconnect();
    }
};

backfillEmbeddings();

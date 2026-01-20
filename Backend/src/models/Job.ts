import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        vacancy: {
            type: Number,
            required: true,
        },
        age: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        salary: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        published: {
            type: String,
            required: true,
        },
        employmentStatus: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        jobLocation: {
            type: String,
            required: true,
        },
        requirements: {
            type: String,
            required: true,
        },
        responsibilities: {
            type: String,
            required: true,
        },
        companyInfo: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
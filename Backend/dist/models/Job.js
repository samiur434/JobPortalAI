"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const JobSchema = new mongoose_1.default.Schema({
    employeeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("Job", JobSchema);

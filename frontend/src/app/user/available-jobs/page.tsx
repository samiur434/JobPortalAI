"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Job {
    _id: string;
    vacancy: number;
    age: string;
    location: string;
    salary: string;
    experience: string;
    published: string;
    employmentStatus: string;
    gender: string;
    jobLocation: string;
    requirements: string;
    responsibilities: string;
    companyInfo: string;
    createdAt: string;
    employeeId?: {
        _id: string;
        companyInfo?: string;
    };
}

export default function AvailableJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
    const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/api/jobs/all");
            if (!response.ok) throw new Error("Failed to fetch jobs");

            const data = await response.json();
            setJobs(data.jobs);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load jobs");
            console.error("Error fetching jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyJob = async (jobId: string) => {
        try {
            setApplyingJobId(jobId);
            const token = localStorage.getItem("userToken");

            if (!token) {
                setError("Please login to apply for jobs");
                setApplyingJobId(null);
                return;
            }

            const response = await fetch("http://localhost:5000/api/jobs/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ jobId }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to apply for job");
            }

            setAppliedJobs(prev => new Set([...prev, jobId]));
            setSuccessMessage("Application submitted successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to apply for job");
            console.error("Error applying for job:", err);
        } finally {
            setApplyingJobId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading jobs...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-md">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
                        <Link
                            href="/user/dashboard"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {successMessage}
                    </div>
                )}

                {jobs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-600 text-lg">No jobs available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Jobs List */}
                        <div className="lg:col-span-2 space-y-4">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    onClick={() => setSelectedJob(job)}
                                    className={`p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition ${selectedJob?._id === job._id ? "border-2 border-blue-600" : ""
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {job.companyInfo || "Company"}
                                            </h3>
                                            <p className="text-gray-600">{job.jobLocation}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                            {job.employmentStatus}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Salary</p>
                                            <p className="text-gray-900 font-semibold">{job.salary}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Experience</p>
                                            <p className="text-gray-900 font-semibold">{job.experience}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Vacancies</p>
                                            <p className="text-gray-900 font-semibold">{job.vacancy}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Age Range</p>
                                            <p className="text-gray-900 font-semibold">{job.age}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {job.requirements}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Job Details */}
                        {selectedJob && (
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        {selectedJob.companyInfo}
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <p className="text-gray-500 text-sm">Location</p>
                                            <p className="text-gray-900 font-semibold">{selectedJob.jobLocation}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Salary</p>
                                            <p className="text-gray-900 font-semibold">{selectedJob.salary}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Experience Required</p>
                                            <p className="text-gray-900 font-semibold">{selectedJob.experience}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Age Range</p>
                                            <p className="text-gray-900 font-semibold">{selectedJob.age}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Employment Type</p>
                                            <p className="text-gray-900 font-semibold">{selectedJob.employmentStatus}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">Vacancies</p>
                                            <p className="text-gray-900 font-semibold">{selectedJob.vacancy}</p>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6 space-y-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Requirements</h3>
                                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedJob.requirements}</p>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Responsibilities</h3>
                                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedJob.responsibilities}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleApplyJob(selectedJob._id)}
                                        disabled={appliedJobs.has(selectedJob._id) || applyingJobId === selectedJob._id}
                                        className={`w-full mt-6 px-4 py-3 rounded-lg font-semibold transition ${appliedJobs.has(selectedJob._id)
                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                            : applyingJobId === selectedJob._id
                                                ? "bg-blue-400 text-white cursor-wait"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                            }`}
                                    >
                                        {appliedJobs.has(selectedJob._id)
                                            ? "Already Applied"
                                            : applyingJobId === selectedJob._id
                                                ? "Applying..."
                                                : "Apply Now"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

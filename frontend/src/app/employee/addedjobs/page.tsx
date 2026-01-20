"use client";

import { useState, useEffect } from "react";

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
}

export default function AddedJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You must be logged in.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/jobs/my-jobs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch jobs");
            }

            setJobs(data.jobs || []);
        } catch (err: unknown) {
            setMessage(err instanceof Error ? err.message : "Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Loading your jobs...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Jobs You Added</h2>
                    <button
                        onClick={() => window.location.href = "/employee/dashboard"}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {message && (
                    <p className={`mb-4 text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}

                {jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600 mb-4">You haven't posted any jobs yet.</p>
                        <button
                            onClick={() => window.location.href = "/employee/postjob"}
                            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Post Your First Job
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white p-6 rounded-lg shadow-md text-black">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <span className="font-semibold">Vacancy:</span> {job.vacancy}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Age:</span> {job.age}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Location:</span> {job.location}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Salary:</span> {job.salary}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Experience:</span> {job.experience}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Published:</span> {job.published}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Status:</span> {job.employmentStatus}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Gender:</span> {job.gender}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <span className="font-semibold">Job Location:</span> {job.jobLocation}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Requirements:</h4>
                                        <p className="text-sm text-gray-700 line-clamp-3">{job.requirements}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Responsibilities:</h4>
                                        <p className="text-sm text-gray-700 line-clamp-3">{job.responsibilities}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Company Info:</h4>
                                        <p className="text-sm text-gray-700 line-clamp-3">{job.companyInfo}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => {/* TODO: Edit job */ }}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {/* TODO: Delete job */ }}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {/* TODO: View applications */ }}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        View Applications
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
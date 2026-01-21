"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Application {
    _id: string;
    jobId: {
        _id: string;
        companyInfo: string;
        vacancy: number;
        salary: string;
        jobLocation: string;
    };
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    status: "pending" | "reviewed" | "accepted" | "rejected";
    appliedAt: string;
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("employeeToken");

            if (!token) {
                setError("Please login as an employee to view applications");
                setLoading(false);
                return;
            }

            const response = await fetch("http://localhost:5000/api/jobs/applications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch applications");
            }

            const data = await response.json();
            setApplications(data.applications);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load applications");
            console.error("Error fetching applications:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (applicationId: string, newStatus: string) => {
        try {
            const token = localStorage.getItem("employeeToken");

            const response = await fetch(`http://localhost:5000/api/jobs/application/${applicationId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Failed to update application status");
            }

            // Update local state
            setApplications(prev =>
                prev.map(app =>
                    app._id === applicationId ? { ...app, status: newStatus as any } : app
                )
            );

            setSuccessMessage("Application status updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update status");
            console.error("Error updating status:", err);
        }
    };

    const filteredApplications = filterStatus === "all"
        ? applications
        : applications.filter(app => app.status === filterStatus);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading applications...</div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "reviewed":
                return "bg-blue-100 text-blue-800";
            case "accepted":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-md">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
                        <Link
                            href="/employee/dashboard"
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

                {/* Filter */}
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`px-4 py-2 rounded ${filterStatus === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-900 border border-gray-300"
                            }`}
                    >
                        All ({applications.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("pending")}
                        className={`px-4 py-2 rounded ${filterStatus === "pending"
                            ? "bg-yellow-600 text-white"
                            : "bg-white text-gray-900 border border-gray-300"
                            }`}
                    >
                        Pending ({applications.filter(a => a.status === "pending").length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("reviewed")}
                        className={`px-4 py-2 rounded ${filterStatus === "reviewed"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-900 border border-gray-300"
                            }`}
                    >
                        Reviewed ({applications.filter(a => a.status === "reviewed").length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("accepted")}
                        className={`px-4 py-2 rounded ${filterStatus === "accepted"
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-900 border border-gray-300"
                            }`}
                    >
                        Accepted ({applications.filter(a => a.status === "accepted").length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("rejected")}
                        className={`px-4 py-2 rounded ${filterStatus === "rejected"
                            ? "bg-red-600 text-white"
                            : "bg-white text-gray-900 border border-gray-300"
                            }`}
                    >
                        Rejected ({applications.filter(a => a.status === "rejected").length})
                    </button>
                </div>

                {filteredApplications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-600 text-lg">
                            {filterStatus === "all"
                                ? "No applications yet."
                                : `No ${filterStatus} applications.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((application) => (
                            <div
                                key={application._id}
                                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">Job Position</p>
                                        <p className="text-gray-900 font-semibold">
                                            {application.jobId.companyInfo}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {application.jobId.jobLocation}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Applicant Name</p>
                                        <p className="text-gray-900 font-semibold">
                                            {application.userId.firstName} {application.userId.lastName}
                                        </p>
                                        <p className="text-gray-600 text-sm">{application.userId.email}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Applied On</p>
                                        <p className="text-gray-900 font-semibold">
                                            {new Date(application.appliedAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {new Date(application.appliedAt).toLocaleTimeString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Status</p>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                                application.status
                                            )}`}
                                        >
                                            {application.status.charAt(0).toUpperCase() +
                                                application.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 flex gap-2 flex-wrap">
                                    <Link
                                        href={`/employee/applications/${application._id}`}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                    >
                                        View Analysis
                                    </Link>
                                    <button
                                        onClick={() => handleStatusChange(application._id, "reviewed")}
                                        disabled={application.status === "reviewed"}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Mark Reviewed
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(application._id, "accepted")}
                                        disabled={application.status === "accepted"}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(application._id, "rejected")}
                                        disabled={application.status === "rejected"}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Reject
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

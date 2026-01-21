"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface ApplicationAnalysis {
    similarityScore: number;
    jobText: string;
    userCvText: string;
    aiSummary: string;
    applicantName: string;
    jobTitle: string;
}

export default function ApplicationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [analysis, setAnalysis] = useState<ApplicationAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetchAnalysis(params.id as string);
        }
    }, [params]);

    const fetchAnalysis = async (applicationId: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("employeeToken");

            if (!token) {
                setError("Please login as an employee");
                router.push("/employee/login");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/jobs/application/${applicationId}/analysis`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) throw new Error("Application not found");
                if (response.status === 403) throw new Error("Unauthorized access");
                throw new Error("Failed to fetch analysis");
            }

            const data = await response.json();
            setAnalysis(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-600">Loading analysis...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
    if (!analysis) return <div className="text-center py-20 text-gray-600">No data found</div>;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-6xl mx-auto px-6 py-6">
                <Link href="/employee/applications" className="text-blue-600 hover:underline mb-4 inline-block">
                    &larr; Back to Applications
                </Link>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Analysis</h1>
                            <p className="text-lg text-gray-600">
                                Applicant: <span className="font-semibold text-gray-900">{analysis.applicantName}</span>
                            </p>
                            <p className="text-gray-600">
                                Job: <span className="font-semibold text-gray-900">{analysis.jobTitle}</span>
                            </p>
                        </div>
                        <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Match Score</p>
                            <p className={`text-5xl font-bold ${getScoreColor(analysis.similarityScore)}`}>
                                {analysis.similarityScore}%
                            </p>
                        </div>
                    </div>

                    {/* AI Summary Section (RAG) */}
                    <div className="mb-10 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-600 text-white p-2.5 rounded-lg mr-4 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">AI Smart Summary</h2>
                                <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Powered by AI Engine</p>
                            </div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-5 rounded-lg border border-white/80 shadow-inner">
                            <p className="text-gray-800 text-lg leading-relaxed italic">
                                "{analysis.aiSummary}"
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Job Details Section */}
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <h2 className="text-xl font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">
                                Job Requirements
                            </h2>
                            <div className="prose text-gray-800 whitespace-pre-wrap text-sm leading-relaxed max-h-[500px] overflow-y-auto">
                                {analysis.jobText}
                            </div>
                        </div>

                        {/* CV Details Section */}
                        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                            <h2 className="text-xl font-bold text-purple-900 mb-4 border-b border-purple-200 pb-2">
                                Candidate CV
                            </h2>
                            <div className="prose text-gray-800 whitespace-pre-wrap text-sm leading-relaxed max-h-[500px] overflow-y-auto">
                                {analysis.userCvText}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

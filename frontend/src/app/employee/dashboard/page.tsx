"use client";

import { useState } from "react";

export default function EmployeeDashboard() {
    const [activeTab, setActiveTab] = useState("total");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/employee/login";
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Employee Dashboard</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab("total")}
                            className={`px-4 py-2 rounded ${activeTab === "total" ? "bg-blue-800" : "hover:bg-blue-700"}`}
                        >
                            Total Jobs
                        </button>
                        <button
                            onClick={() => window.location.href = "/employee/addedjobs"}
                            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
                        >
                            Jobs You Added
                        </button>
                        <button
                            onClick={() => setActiveTab("applied")}
                            className={`px-4 py-2 rounded ${activeTab === "applied" ? "bg-blue-800" : "hover:bg-blue-700"}`}
                        >
                            Applied to Your Jobs
                        </button>
                        <button
                            onClick={() => window.location.href = "/employee/postjob"}
                            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                        >
                            Post a New Job
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto p-6">
                {activeTab === "total" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Total Jobs</h2>
                        <p>Display all available jobs here.</p>
                        {/* TODO: Fetch and display total jobs */}
                    </div>
                )}

                {activeTab === "added" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Jobs You Added</h2>
                        <p>Display jobs posted by this employee.</p>
                        {/* TODO: Fetch and display employee's posted jobs */}
                    </div>
                )}

                {activeTab === "applied" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Applications to Your Jobs</h2>
                        <p>Display applications received for jobs posted by this employee.</p>
                        {/* TODO: Fetch and display applications */}
                    </div>
                )}
            </div>
        </div>
    );
}

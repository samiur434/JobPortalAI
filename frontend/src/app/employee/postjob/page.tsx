"use client";

import { useState, FormEvent } from "react";

export default function PostJobPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [completedTabs, setCompletedTabs] = useState({
        all: false,
        requirements: false,
        responsibilities: false,
        company: false,
    });
    const [form, setForm] = useState({
        vacancy: "",
        age: "",
        location: "",
        salary: "",
        experience: "",
        employmentStatus: "full-time",
        gender: "",
        jobLocation: "",
        requirements: "",
        responsibilities: "",
        companyInfo: "",
    });
    const [message, setMessage] = useState("");

    const isAllTabComplete = () => {
        return form.vacancy !== "" && form.age !== "" && form.location !== "" && form.salary !== "" &&
            form.experience !== "" && form.employmentStatus !== "" && form.gender !== "" && form.jobLocation !== "";
    };

    const isRequirementsComplete = () => {
        return form.requirements.trim().length > 0;
    };

    const isResponsibilitiesComplete = () => {
        return form.responsibilities.trim().length > 0;
    };

    const isCompanyComplete = () => {
        return form.companyInfo.trim().length > 0;
    };

    const handleTabChange = (tab: string) => {
        if (tab === "all") {
            setActiveTab(tab);
            return;
        }

        if (tab === "requirements" && !isAllTabComplete()) {
            setMessage("Please complete all fields in the 'All' section first.");
            return;
        }

        if (tab === "responsibilities" && (!isAllTabComplete() || !isRequirementsComplete())) {
            setMessage("Please complete the 'All' and 'Requirements' sections first.");
            return;
        }

        if (tab === "company" && (!isAllTabComplete() || !isRequirementsComplete() || !isResponsibilitiesComplete())) {
            setMessage("Please complete all previous sections first.");
            return;
        }

        setMessage("");
        setActiveTab(tab);

        // Update completed status
        if (tab === "requirements" && isAllTabComplete()) {
            setCompletedTabs(prev => ({ ...prev, all: true }));
        } else if (tab === "responsibilities" && isRequirementsComplete()) {
            setCompletedTabs(prev => ({ ...prev, requirements: true }));
        } else if (tab === "company" && isResponsibilitiesComplete()) {
            setCompletedTabs(prev => ({ ...prev, responsibilities: true }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage("");

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You must be logged in.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/jobs/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...form,
                    published: new Date().toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to post job");
            }

            setMessage("Job posted successfully!");
            setForm({
                vacancy: "",
                age: "",
                location: "",
                salary: "",
                experience: "",
                employmentStatus: "full-time",
                gender: "",
                jobLocation: "",
                requirements: "",
                responsibilities: "",
                companyInfo: "",
            });
            // Redirect to dashboard after successful post
            setTimeout(() => {
                window.location.href = "/employee/dashboard";
            }, 2000); // 2 second delay to show success message
        } catch (err: unknown) {
            setMessage(err instanceof Error ? err.message : "Failed to post job");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-center">Post a New Job</h2>

                {message && (
                    <p className={`mb-4 text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}

                {/* Tab Navigation */}
                <div className="flex mb-6 border-b">
                    {[
                        { key: "all", label: "All", enabled: true },
                        { key: "requirements", label: "Requirements", enabled: isAllTabComplete() },
                        { key: "responsibilities", label: "Responsibilities", enabled: isAllTabComplete() && isRequirementsComplete() },
                        { key: "company", label: "Company Information", enabled: isAllTabComplete() && isRequirementsComplete() && isResponsibilitiesComplete() }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            disabled={!tab.enabled}
                            className={`px-6 py-3 font-medium ${activeTab === tab.key
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : tab.enabled
                                    ? "text-gray-600 hover:text-blue-600"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md text-black">
                    {activeTab === "all" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Vacancy</label>
                                    <input
                                        type="number"
                                        name="vacancy"
                                        value={form.vacancy}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded"
                                        placeholder="e.g., 2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Age</label>
                                    <input
                                        type="text"
                                        name="age"
                                        value={form.age}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded"
                                        placeholder="e.g., 22 to 30 years"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded"
                                        placeholder="e.g., Dhaka (Mirpur Section 11)"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Salary</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={form.salary}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded"
                                        placeholder="e.g., Tk. 20000 - 30000 (Monthly)"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Experience</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={form.experience}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded"
                                        placeholder="e.g., 1 to 2 years"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Employment Status</label>
                                    <select
                                        name="employmentStatus"
                                        value={form.employmentStatus}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded"
                                        required
                                    >
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="any">Any</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Job Location</label>
                                    <input
                                        type="text"
                                        name="jobLocation"
                                        value={form.jobLocation}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded"
                                        placeholder="e.g., Office-based"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "requirements" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Requirements</label>
                            <textarea
                                name="requirements"
                                value={form.requirements}
                                onChange={handleChange}
                                className="w-full p-3 border rounded h-64"
                                placeholder="Enter detailed job requirements..."
                                required
                            />
                        </div>
                    )}

                    {activeTab === "responsibilities" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Responsibilities</label>
                            <textarea
                                name="responsibilities"
                                value={form.responsibilities}
                                onChange={handleChange}
                                className="w-full p-3 border rounded h-64"
                                placeholder="Enter job responsibilities..."
                                required
                            />
                        </div>
                    )}

                    {activeTab === "company" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Company Information</label>
                            <textarea
                                name="companyInfo"
                                value={form.companyInfo}
                                onChange={handleChange}
                                className="w-full p-3 border rounded h-64"
                                placeholder="Enter company information..."
                                required
                            />
                            {isAllTabComplete() && isRequirementsComplete() && isResponsibilitiesComplete() && isCompanyComplete() && (
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                                    >
                                        Post Job
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 flex justify-between">
                        <button
                            type="button"
                            onClick={() => window.location.href = "/employee/dashboard"}
                            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
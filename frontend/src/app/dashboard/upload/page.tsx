"use client";

import { useState } from "react";

export default function UploadCVPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a PDF file.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You must be logged in.");
            return;
        }

        const formData = new FormData();
        formData.append("cv", file);

        try {
            setLoading(true);
            setMessage("");

            const res = await fetch("http://localhost:5000/api/cv/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Upload failed");
            }

            setMessage("CV uploaded and processed successfully.");
        } catch (err: unknown) {
            setMessage(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4">Upload Your CV</h1>

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="mb-4"
                />

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Processing..." : "Upload CV"}
                </button>

                {message && (
                    <p className="mt-4 text-sm text-center text-gray-700">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

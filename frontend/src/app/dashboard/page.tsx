"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in (token in localStorage)
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); // redirect to login if not logged in
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            {/* Navbar */}
            <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Job Portal</h1>
                <ul className="flex gap-6">
                    <li>
                        <button
                            onClick={() => router.push("/look-jobs")}
                            className="hover:text-blue-600"
                        >
                            Look Jobs
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => router.push("/jobs-applied")}
                            className="hover:text-blue-600"
                        >
                            Jobs Applied
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => router.push("dashboard/upload")}
                            className="hover:text-blue-600"
                        >
                            Upload CV
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="text-red-600 hover:text-red-800"
                        >
                            Log Out
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Main content */}
            <main className="flex flex-col items-center justify-center mt-20">
                <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
                <p>Welcome to your dashboard!</p>
            </main>
        </div>
    );
}

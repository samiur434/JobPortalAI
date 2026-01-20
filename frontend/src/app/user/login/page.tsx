"use client";

import { useState, FormEvent } from "react";

export default function UserLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json(); // now this will work

            if (!res.ok) {
                setError(data.message || "Login failed");
                return;
            }

            // TODO: Save token / redirect to dashboard
            console.log("Login success:", data);
            // For example:
            localStorage.setItem("token", data.token);
            window.location.href = "/dashboard";

        } catch (err) {
            setError("Server error. Please try again later.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">User Login</h2>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 border rounded"
                        required
                    />

                    <button
                        type="submit"
                        className="py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Don&apos;t have an account? <a href="/user/register" className="text-blue-600 hover:underline">Register</a>
                </p>
            </div>
        </div>
    );
}
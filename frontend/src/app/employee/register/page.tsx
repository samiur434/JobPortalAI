"use client";

import { useState, FormEvent } from "react";

export default function EmployeeRegister() {
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name || !companyName || !email || !password || !confirmPassword) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/employee/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, companyName, email, phone, role, password }),
            });

            const data = await res.json(); // now this will work


            if (!res.ok) {
                setError(data.message || "Registration failed");
                return;
            }

            setSuccess("Registration successful! You can now login.");
            setName("");
            setCompanyName("");
            setEmail("");
            setPhone("");
            setRole("");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError("Server error. Please try again later.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Employee Register</h2>

                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-3 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Company Name (Unique)"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="p-3 border rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone Number (Optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="p-3 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Role / Position (Optional)"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="p-3 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="p-3 border rounded"
                        required
                    />

                    <button
                        type="submit"
                        className="py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Already have an account? <a href="/employee/login" className="text-green-600 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
}

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation"; // Next.js router for redirect

type Gender = "male" | "female" | "other" | "";

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "" as Gender,
        countryCode: "",
        phoneNumber: "",
    });

    const countries = [
        { name: "Bangladesh", code: "+880" },
        { name: "India", code: "+91" },
        { name: "United States", code: "+1" },
        { name: "United Kingdom", code: "+44" },
        { name: "Canada", code: "+1" },
        // Add more countries as needed
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                // Show backend error message
                alert(data.message || "Registration failed");
                return;
            }

            // Success: show notification
            alert("User registered successfully!");

            // Redirect to login page
            router.push("/user/login");
        } catch (err) {
            console.error("Registration error:", err);
            alert("Failed to connect to server");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">Register</h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            className="flex-1 p-3 border rounded text-black"
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            className="flex-1 p-3 border rounded text-black"
                            required
                        />
                    </div>

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        className="flex-1 p-3 border rounded text-black"
                        required
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="flex-1 p-3 border rounded text-black"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="flex-1 p-3 border rounded text-black"
                        required
                    />

                    {/* Gender */}
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="flex-1 p-3 border rounded text-black"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                    {/* Phone Number */}
                    <div className="flex gap-2">
                        <select
                            name="countryCode"
                            value={form.countryCode}
                            onChange={handleChange}
                            className="w-32 p-3 border rounded text-black"
                            required
                        >
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name} ({country.code})
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            className="flex-1 p-3 border rounded text-black"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-sm mt-4 text-center">
                    Already have an account?{" "}
                    <a href="/user/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
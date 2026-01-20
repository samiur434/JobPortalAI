"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Users_1 = __importDefault(require("../models/Users"));
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, gender, countryCode, phoneNumber, } = req.body;
        // 1. Basic validation
        if (!firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !gender ||
            !countryCode ||
            !phoneNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        // 2. Check if user already exists
        const existingUser = await Users_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }
        // 3. Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
        // 4. Create user
        const user = await Users_1.default.create({
            firstName,
            lastName,
            email,
            passwordHash,
            gender,
            countryCode,
            phoneNumber,
        });
        // 5. Response (never send password)
        return res.status(201).json({
            message: "User registered successfully",
            userId: user._id,
        });
    }
    catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.registerUser = registerUser;

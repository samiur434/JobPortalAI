"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../models/Users"));
const router = express_1.default.Router();
// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, countryCode, phoneNumber } = req.body;
        // Check if user exists
        const existingUser = await Users_1.default.findOne({ email });
        if (existingUser)
            return res.status(409).json({ message: "User already exists" });
        // Hash password
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const newUser = new Users_1.default({
            firstName,
            lastName,
            email,
            passwordHash,
            gender,
            countryCode,
            phoneNumber,
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        res.json({ token, userId: user._id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;

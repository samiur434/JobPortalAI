import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/Users";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, countryCode, phoneNumber } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "User already exists" });

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        res.json({ token, userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

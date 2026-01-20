import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Employee from "../../models/Employee";

const router = express.Router();

// POST /api/employee/login
router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const employee = await Employee.findOne({ email });
        if (!employee) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign(
            { employeeId: employee._id, companyName: employee.companyName },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: "7d" }
        );

        return res.json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;

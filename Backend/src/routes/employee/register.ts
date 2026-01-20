import express from "express";
import bcrypt from "bcrypt";
import Employee, { IEmployee } from "../../models/Employee";

const router = express.Router();

// POST /api/employee/register
router.post("/", async (req, res) => {
    try {
        const { name, companyName, email, phone, role, password } = req.body;

        if (!name || !companyName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        // Check if companyName or email already exists
        const existingEmployee = await Employee.findOne({
            $or: [{ companyName }, { email }],
        });
        if (existingEmployee) {
            return res.status(400).json({ message: "Company name or email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await Employee.create({
            name,
            companyName,
            email,
            phone,
            role,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "Employee registered successfully", employeeId: employee._id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Employee_1 = __importDefault(require("../../models/Employee"));
const router = express_1.default.Router();
// POST /api/employee/register
router.post("/", async (req, res) => {
    try {
        const { name, companyName, email, phone, role, password } = req.body;
        if (!name || !companyName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }
        // Check if companyName or email already exists
        const existingEmployee = await Employee_1.default.findOne({
            $or: [{ companyName }, { email }],
        });
        if (existingEmployee) {
            return res.status(400).json({ message: "Company name or email already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const employee = await Employee_1.default.create({
            name,
            companyName,
            email,
            phone,
            role,
            password: hashedPassword,
        });
        return res.status(201).json({ message: "Employee registered successfully", employeeId: employee._id });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Employee_1 = __importDefault(require("../../models/Employee"));
const router = express_1.default.Router();
// POST /api/employee/login
router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });
        const employee = await Employee_1.default.findOne({ email });
        if (!employee)
            return res.status(401).json({ message: "Invalid credentials" });
        const isMatch = await bcrypt_1.default.compare(password, employee.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ employeeId: employee._id, companyName: employee.companyName }, process.env.JWT_SECRET || "supersecret", { expiresIn: "7d" });
        return res.json({ message: "Login successful", token });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;

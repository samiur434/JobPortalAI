
import { connectDB } from "./config/db";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/auth";
import cors from "cors";
import cvRoutes from "./routes/cv";
import employeeRegisterRouter from "./routes/employee/register";
import employeeLoginRouter from "./routes/employee/login";
import jobsRoutes from "./routes/jobs";

const app = express();
app.use(express.json());

connectDB();
app.use(cors());
app.use("/api/auth", authRoutes);


app.use("/api/cv", cvRoutes);
app.use("/api/jobs", jobsRoutes);

// Employee routes
app.use("/api/employee/register", employeeRegisterRouter);
app.use("/api/employee/login", employeeLoginRouter);

// Example Route
app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

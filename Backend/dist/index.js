"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./config/db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const cv_1 = __importDefault(require("./routes/cv"));
const register_1 = __importDefault(require("./routes/employee/register"));
const login_1 = __importDefault(require("./routes/employee/login"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, db_1.connectDB)();
app.use((0, cors_1.default)());
app.use("/api/auth", auth_1.default);
app.use("/api/cv", cv_1.default);
app.use("/api/jobs", jobs_1.default);
// Employee routes
app.use("/api/employee/register", register_1.default);
app.use("/api/employee/login", login_1.default);
// Example Route
app.get("/", (req, res) => {
    res.send("Server is running");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

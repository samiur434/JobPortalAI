import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
    name: string;
    companyName: string;
    email: string;
    phone?: string;
    role?: string;
    password: string;
}

const EmployeeSchema = new Schema<IEmployee>(
    {
        name: { type: String, required: true },
        companyName: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        role: { type: String },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    gender: string;
    countryCode: string;
    phoneNumber: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: { type: String, required: true },
    gender: { type: String, required: true },
    countryCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    console.log("[Auth] Method:", req.method, "URL:", req.originalUrl);
    if (!authHeader) {
        console.log("[Auth] No auth header provided");
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "supersecret"
        );
        console.log("[Auth] Decoded token:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("[Auth] Token verification failed:", err);
        res.status(401).json({ message: "Invalid token" });
    }
};

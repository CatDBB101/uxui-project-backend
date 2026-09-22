import Student from "@/models/student.models";
import Teacher from "@/models/teacher.models";
import type { NextFunction, Request, Response } from "express";

// Removed unnecessary 'async' from the factory function wrapper
export const verifyCookieMiddleware = (type: "student" | "teacher") => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.key;
            if (!token || Array.isArray(token)) {
                res.status(401).json({
                    error: "Access denied. No token provided in headers.",
                });
                return;
            }

            const user: {
                type: "student" | "teacher";
                id: string;
            } = JSON.parse(token);

            if (user.type !== type) {
                res.status(403).json({
                    error: "Access denied. Unauthorized user type.",
                });
                return;
            }

            let foundUser;
            if (user.type === "teacher") {
                foundUser = await Teacher.findById(user.id).lean();
            } else {
                foundUser = await Student.findById(user.id).lean();
            }

            if (!foundUser) {
                res.status(403).json({ error: "Wrong id or user not found" });
                return;
            }

            (req as any).user = foundUser;

            next();
        } catch (error) {
            res.status(401).json({ error: "Invalid or expired token." });
            return;
        }
    };
};

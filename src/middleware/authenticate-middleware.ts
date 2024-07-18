import { NextFunction, Response } from "express";
import { verifyAcessToken } from "../utils/jwt";
import { AuthenticateRequest } from "../types/authenticatedRequest";
import { UserResponse } from "../model/user-model";

export const authenticate = (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    const user = verifyAcessToken(String(token));
    if (token === undefined || user === null || user === undefined) {
        return res.status(401).json({
            error: "Unauthenticated",
        });
    }

    if (user !== null || user !== undefined) {
        req.user = user as UserResponse;
    }

    next();
};

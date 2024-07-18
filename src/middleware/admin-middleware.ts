import { NextFunction, Response } from "express";
import { AuthenticateRequest } from "../types/authenticatedRequest";
import { prismaClient } from "../application/database";

export const adminMiddleware = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    if (req.user !== undefined) {
        try {
            const findRole = await prismaClient.role.findUnique({
                where: {
                    users_id: req.user.id,
                },
            });

            console.log("admin", findRole?.admin);

            if (findRole !== null && !findRole.admin) {
                return res.status(401).json({
                    error: "Unauthorized",
                });
            }
        } catch (error) {
            next(error);
        }
    } else {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }

    next();
};

import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../application/database";

export const checkUniqueEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (user) {
        return res.status(400).json({
            message: "Email already exists",
        });
    }
    next();
};

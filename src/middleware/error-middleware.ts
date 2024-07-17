import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        const errorMessges = error.errors.map((err) => ({
            field: err.path[0],
            message: err.message,
        }));
        return res.status(400).json({
            errors: errorMessges,
        });
    } else if (error instanceof ResponseError) {
        return res.status(error.status).json({
            errors: error.message,
        });
    } else {
        return res.status(500).json({
            errors: error.message,
        });
    }

    next();
};

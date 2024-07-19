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
            message: `${error.errors[0].path[0]} ${error.errors[0].message}`,
            error: errorMessges,
        });
    } else if (error instanceof ResponseError) {
        return res.status(error.status).json({
            error: error.message,
        });
    } else {
        return res.status(500).json({
            error: error.message,
        });
    }

    next();
};

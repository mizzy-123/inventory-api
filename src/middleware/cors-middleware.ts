import express from "express";
import cors from "cors";

const corsMiddleware = express();

corsMiddleware.use(
    cors({
        origin: true,
        credentials: true,
        preflightContinue: false,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
);

corsMiddleware.options("*", cors());

export default corsMiddleware;

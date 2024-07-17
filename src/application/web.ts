import express from "express";
import corsMiddleware from "../middleware/cors-middleware";

export const web = express();
web.use(corsMiddleware);
web.use(express.json());

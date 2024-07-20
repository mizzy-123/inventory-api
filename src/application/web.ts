import express from "express";
import corsMiddleware from "../middleware/cors-middleware";
import appRouter from "../routes";
import { errorMiddleware } from "../middleware/error-middleware";
import { notFoundMiddleware } from "../middleware/notfound-middleware";
// import bodyParser from "body-parser";

export const web = express();

web.use("/public", express.static("./public"));

web.use(corsMiddleware);
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(appRouter);
web.use(errorMiddleware);
web.use(notFoundMiddleware);

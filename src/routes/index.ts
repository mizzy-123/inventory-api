import { Router } from "express";
import { apiRouter } from "./api";
import { publicRouter } from "./public-api";

const appRouter = Router();

appRouter.use("/api", publicRouter);
appRouter.use("/api", apiRouter);

export default appRouter;

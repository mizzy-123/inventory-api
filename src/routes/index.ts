import { Router } from "express";
import { apiRouter } from "./api";
import { publicRouter } from "./public-api";
import { authenticateMiddleware } from "../middleware/authenticate-middleware";

const appRouter = Router();

appRouter.use("/api", publicRouter);
appRouter.use("/api", authenticateMiddleware, apiRouter);

export default appRouter;

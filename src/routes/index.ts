import { Router } from "express";
import { apiRouter } from "./api";
import { publicRouter } from "./public-api";
import { authenticate } from "../middleware/authenticate-middleware";

const appRouter = Router();

appRouter.use("/api", publicRouter);
appRouter.use("/api", authenticate, apiRouter);

export default appRouter;

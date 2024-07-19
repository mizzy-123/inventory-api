import { Router } from "express";
import { UserController } from "../controller/user-controller";
import { adminMiddleware } from "../middleware/admin-middleware";

export const apiRouter = Router();

// User API
apiRouter.post("/users/profile", UserController.updateUserProfile);
apiRouter.post("/users", UserController.createUser);
apiRouter.post("/users/role", adminMiddleware, UserController.updateUserWithRole);

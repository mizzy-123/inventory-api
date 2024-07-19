import { Router } from "express";
import { UserController } from "../controller/user-controller";
import { adminMiddleware } from "../middleware/admin-middleware";
import { checkUniqueEmail } from "../middleware/check-unique-email-middleware";

export const apiRouter = Router();

// User API
apiRouter.post("/users/profile", UserController.updateUserProfile);
apiRouter.post("/users", adminMiddleware, checkUniqueEmail, UserController.createUser);
apiRouter.post("/users/:id/role", adminMiddleware, UserController.updateUserRole);

import { Router } from "express";
import { UserController } from "../controller/user-controller";
import { adminMiddleware } from "../middleware/admin-middleware";
import { checkUniqueEmail } from "../middleware/check-unique-email-middleware";
import upload from "../utils/multer";

export const apiRouter = Router();

// User API
apiRouter.post("/users/profile", upload.single("photo"), UserController.updateUserProfile);
apiRouter.get("/users/profile", UserController.getUserProfile);
apiRouter.put("/users/password", UserController.changePassword);
apiRouter.post("/users", adminMiddleware, checkUniqueEmail, UserController.createUser);
apiRouter.post("/users/:id/role", adminMiddleware, UserController.updateUserRole);

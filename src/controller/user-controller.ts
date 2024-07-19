import { NextFunction, Request, Response } from "express";
import { CreateUserRequest, CreateUserWithRoleRequest, LoginUserRequest, UpdateUserProfileRequest, UpdateUserRoleRequest } from "../model/user-model";
import { UserService } from "../service/user-service";
import { AuthenticateRequest } from "../types/authenticatedRequest";

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            const response = await UserService.register(request);
            res.status(200).json({
                message: "Register successfull",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response = await UserService.login(request);
            res.status(200).json({
                message: "Login successfull",
                data: {
                    email: response.email,
                    username: response.username,
                },
                access_token: response.access_token,
                refresh_token: response.refresh_token,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateUserProfile(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateUserProfileRequest = req.body as UpdateUserProfileRequest;
            const response = await UserService.updateUserProfile(request, req.user);
            res.status(200).json({
                message: "Update successfull",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async createUser(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateUserWithRoleRequest = req.body as CreateUserWithRoleRequest;
            const response = await UserService.createUserWithRole(request);
            res.status(201).json({
                message: "Create User Successfull",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateUserRole(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateUserRoleRequest = req.body as UpdateUserRoleRequest;
            const response = await UserService.updateUserRole(request, req.params.id);

            res.status(200).json({
                message: "Update role user successfull",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }
}

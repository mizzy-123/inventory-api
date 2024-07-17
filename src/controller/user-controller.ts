import { NextFunction, Request, Response } from "express";
import { CreateUserRequest, LoginUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";

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
}

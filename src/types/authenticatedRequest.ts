import { Request } from "express";
import { UserResponse } from "../model/user-model";

export interface AuthenticateRequest extends Request {
    user?: UserResponse;
}

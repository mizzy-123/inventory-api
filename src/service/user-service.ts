import { User } from "@prisma/client";
import { CreateUserRequest, LoginUserRequest, toUserResponseToken, UserResponseToken } from "../model/user-model";
import { Validation } from "../validation/validation";
import { UserValidation } from "../validation/user-validation";
import bcrypt from "bcrypt";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export class UserService {
    static async register(request: CreateUserRequest): Promise<User> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prismaClient.user.create({
            data: registerRequest,
        });

        return user;
    }

    static async login(request: LoginUserRequest): Promise<UserResponseToken> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        const user = await prismaClient.user.findUnique({
            where: {
                email: loginRequest.email,
            },
        });

        if (!user) {
            throw new ResponseError(401, "Username or password is wrong");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError(401, "Username or password is wrong");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return toUserResponseToken(user, accessToken, refreshToken);
    }
}

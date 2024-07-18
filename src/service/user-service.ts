import { CreateUserRequest, LoginUserRequest, toUserResponse, toUserResponseToken, UserResponse, UserResponseToken } from "../model/user-model";
import { Validation } from "../validation/validation";
import { UserValidation } from "../validation/user-validation";
import bcrypt from "bcrypt";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prismaClient.user.create({
            data: {
                email: registerRequest.email,
                username: registerRequest.username,
                password: registerRequest.password,
                roles: {
                    create: {
                        staff: true,
                    },
                },
            },
        });

        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponseToken> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        const user = await prismaClient.user.findUnique({
            where: {
                email: loginRequest.email,
            },
            include: {
                roles: true,
            },
        });

        if (!user) {
            throw new ResponseError(401, "Username or password is wrong");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError(401, "Username or password is wrong");
        }

        const userResponse = toUserResponse(user);

        const accessToken = generateAccessToken(userResponse);
        const refreshToken = generateRefreshToken(userResponse);

        return toUserResponseToken(user, accessToken, refreshToken);
    }
}

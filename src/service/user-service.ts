import { CreateUserRequest, CreateUserWithRoleRequest, LoginUserRequest, toUserResponse, toUserResponseToken, UpdateUserProfileRequest, UserResponse, UserResponseToken } from "../model/user-model";
import { Validation } from "../validation/validation";
import { UserValidation } from "../validation/user-validation";
import bcrypt from "bcrypt";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { User } from "@prisma/client";

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

    static async updateUserProfile(request: UpdateUserProfileRequest, user: UserResponse | undefined): Promise<UserResponse> {
        const resultValidation = Validation.validate(UserValidation.UPDATE_USER_PROFILE, request);
        const userResponse = await prismaClient.user.update({
            where: {
                id: user?.id,
            },
            data: {
                username: resultValidation.username,
            },
        });

        return toUserResponse(userResponse);
    }

    static async createUserWithRole(request: CreateUserWithRoleRequest): Promise<UserResponse> {
        const resultValidation = Validation.validate(UserValidation.CREATE_USER_WITH_ROLE, request);

        resultValidation.password = await bcrypt.hash(resultValidation.password, 10);
        let resultCreateUser: User;
        switch (resultValidation.role) {
            case "admin": {
                const user = await prismaClient.user.create({
                    data: {
                        email: resultValidation.email,
                        username: resultValidation.username,
                        password: resultValidation.password,
                        roles: {
                            create: {
                                admin: true,
                            },
                        },
                    },
                });

                resultCreateUser = user;
                break;
            }
            case "manager": {
                const user = await prismaClient.user.create({
                    data: {
                        email: resultValidation.email,
                        username: resultValidation.username,
                        password: resultValidation.password,
                        roles: {
                            create: {
                                manager: true,
                            },
                        },
                    },
                });

                resultCreateUser = user;
                break;
            }
            case "staff": {
                const user = await prismaClient.user.create({
                    data: {
                        email: resultValidation.email,
                        username: resultValidation.username,
                        password: resultValidation.password,
                        roles: {
                            create: {
                                staff: true,
                            },
                        },
                    },
                });

                resultCreateUser = user;
                break;
            }
            default:
                throw new ResponseError(401, "Invalid role");
        }

        return toUserResponse(resultCreateUser);
    }
}

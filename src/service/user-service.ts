import {
    CreateUserRequest,
    CreateUserWithRoleRequest,
    GetUserWithUserDataResponse,
    LoginUserRequest,
    toGetUserWithUserDataResponse,
    toUserResponse,
    toUserResponseToken,
    toUserRole,
    UpdatePasswordUserRequest,
    UpdateUserProfileRequest,
    UpdateUserRoleRequest,
    UserResponse,
    UserResponseToken,
} from "../model/user-model";
import { Validation } from "../validation/validation";
import { UserValidation } from "../validation/user-validation";
import bcrypt from "bcryptjs";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { User } from "@prisma/client";
import path from "path";
import fs from "fs";

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
                user_data: {
                    create: {},
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
            throw new ResponseError(400, "Username or password is wrong");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError(400, "Username or password is wrong");
        }

        const userResponse = toUserRole(user, user.roles);

        const accessToken = generateAccessToken(userResponse);
        const refreshToken = generateRefreshToken(userResponse);

        return toUserResponseToken(user, accessToken, refreshToken);
    }

    static async changePassword(request: UpdatePasswordUserRequest, user: UserResponse | undefined): Promise<UserResponse> {
        const changePasswordRequest = Validation.validate(UserValidation.UPDATE_PASSWORD, request);

        if (!user) {
            throw new ResponseError(400, "User not found");
        }

        changePasswordRequest.password = await bcrypt.hash(changePasswordRequest.password, 10);

        const userResponse = await prismaClient.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: changePasswordRequest.password,
            },
        });

        return toUserResponse(userResponse);
    }

    static async updateUserProfile(request: UpdateUserProfileRequest, user: UserResponse | undefined, photo: Express.Multer.File | undefined): Promise<UserResponse> {
        const resultValidation = Validation.validate(UserValidation.UPDATE_USER_PROFILE, request);

        if (!user) {
            throw new ResponseError(400, "User not found");
        }

        if (photo == undefined) {
            const userResponse = await prismaClient.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                    username: resultValidation.username,
                },
            });

            return toUserResponse(userResponse);
        } else {
            const findUser = await prismaClient.user.findUnique({
                where: {
                    id: user.id,
                },
                include: {
                    user_data: true,
                },
            });

            if (!findUser) {
                throw new ResponseError(404, "User not found");
            }

            const userData = findUser.user_data;

            if (userData?.foto) {
                const oldImagePath = path.join("public", "images", userData.foto);
                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                    } catch (error) {
                        throw new ResponseError(500, "Error deleting old photo");
                    }
                }
            }

            const userResponse = await prismaClient.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                    username: resultValidation.username,
                    user_data: {
                        update: {
                            data: {
                                foto: photo.filename,
                            },
                        },
                    },
                },
            });

            return toUserResponse(userResponse);
        }
    }

    static async getUserProfile(user: UserResponse | undefined): Promise<GetUserWithUserDataResponse> {
        if (!user) {
            throw new ResponseError(400, "User not found");
        }

        const userResponse = await prismaClient.user.findUnique({
            where: {
                id: user.id,
            },
            include: {
                user_data: true,
            },
        });

        if (!userResponse) {
            throw new ResponseError(500, "User not found");
        }

        if (!userResponse.user_data) {
            throw new ResponseError(500, "User data not found");
        }

        return toGetUserWithUserDataResponse(userResponse, userResponse.user_data);
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
                        user_data: {
                            create: {},
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
                        user_data: {
                            create: {},
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
                        user_data: {
                            create: {},
                        },
                    },
                });

                resultCreateUser = user;
                break;
            }
            default:
                throw new ResponseError(400, "Invalid role");
        }

        return toUserResponse(resultCreateUser);
    }

    static async updateUserRole(request: UpdateUserRoleRequest, id: string): Promise<UserResponse> {
        const resultValidation = Validation.validate(UserValidation.UPDATE_USER_ROLE, request);

        let resultCreateUser: User | null;
        switch (resultValidation.role) {
            case "admin": {
                const role = await prismaClient.role.update({
                    data: {
                        admin: true,
                    },
                    where: {
                        users_id: id,
                    },
                });

                const user = await prismaClient.user.findUnique({
                    where: {
                        id: role.users_id,
                    },
                });

                resultCreateUser = user;
                break;
            }
            case "manager": {
                const role = await prismaClient.role.update({
                    data: {
                        manager: true,
                    },
                    where: {
                        users_id: id,
                    },
                });

                const user = await prismaClient.user.findUnique({
                    where: {
                        id: role.users_id,
                    },
                });

                resultCreateUser = user;
                break;
            }
            case "staff": {
                const role = await prismaClient.role.update({
                    data: {
                        staff: true,
                    },
                    where: {
                        users_id: id,
                    },
                });

                const user = await prismaClient.user.findUnique({
                    where: {
                        id: role.users_id,
                    },
                });

                resultCreateUser = user;
                break;
            }
            default:
                throw new ResponseError(400, "Invalid role");
        }

        if (!resultCreateUser) {
            throw new ResponseError(404, "User not found");
        }

        return toUserResponse(resultCreateUser);
    }
}

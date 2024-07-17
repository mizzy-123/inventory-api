import { User } from "@prisma/client";

export type CreateUserRequest = {
    email: string;
    username: string;
    password: string;
};

export type LoginUserRequest = {
    email: string;
    password: string;
};

export type UserResponseToken = {
    email: string;
    username: string;
    access_token: string;
    refresh_token: string;
};

export function toUserResponseToken(user: User, accesToken: string, refreshToken: string): UserResponseToken {
    return {
        email: user.email,
        username: user.username,
        access_token: accesToken,
        refresh_token: refreshToken,
    };
}

import { Role, User, UserData } from "@prisma/client";
import "dotenv/config";

export type CreateUserRequest = {
    email: string;
    username: string;
    password: string;
};

export type CreateUserWithRoleRequest = {
    email: string;
    username: string;
    password: string;
    role: string;
};

export type UpdateUserRoleRequest = {
    role: string;
};

export type UpdatePasswordUserRequest = {
    password: string;
};

export type LoginUserRequest = {
    email: string;
    password: string;
};

export type UserRole = {
    id: string;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    roles: {
        admin: boolean | undefined;
        manager: boolean | undefined;
        staff: boolean | undefined;
    };
};

export type UserResponse = {
    id: string;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
};

export type UserResponseToken = {
    email: string;
    username: string;
    access_token: string;
    refresh_token: string;
};

export type UpdateUserProfileRequest = {
    username: string;
};

export type GetUserWithUserDataResponse = {
    id: string;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    user_data: {
        foto: string | null;
    };
};

export function toGetUserWithUserDataResponse(user: User, userData: UserData): GetUserWithUserDataResponse {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        user_data: {
            foto: `${process.env.IMAGE_URL}${userData.foto}`,
        },
    };
}

export function toUserRole(user: User, role: Role | null): UserRole {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        roles: {
            admin: role?.admin,
            manager: role?.manager,
            staff: role?.staff,
        },
    };
}

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
}

export function toUserResponseToken(user: User, accesToken: string, refreshToken: string): UserResponseToken {
    return {
        email: user.email,
        username: user.username,
        access_token: accesToken,
        refresh_token: refreshToken,
    };
}

import "dotenv/config";
import jsonWebToken from "jsonwebtoken";
import { UserResponse } from "../model/user-model";

export const generateAccessToken = (user: UserResponse): string => {
    return jsonWebToken.sign(user, String(process.env.JWT_SECRET), {
        expiresIn: process.env.JWT_EXPIRES_IN != null ? String(process.env.JWT_EXPIRES_IN) : "1800s",
    });
};

export const generateRefreshToken = (user: UserResponse): string => {
    return jsonWebToken.sign(user, String(process.env.JWT_REFRESH_SECRET), {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN != null ? String(process.env.JWT_REFRESH_EXPIRES_IN) : "1800s",
    });
};

export const verifyRefreshToken = (token: string): string | jsonWebToken.JwtPayload | null => {
    try {
        return jsonWebToken.verify(token, String(process.env.JWT_REFRESH_SECRET));
    } catch (error: Error | unknown) {
        return null;
    }
};

export const parseJWT = (token: string) => {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
};

export const verifyAcessToken = (token: string): string | jsonWebToken.JwtPayload | null => {
    try {
        return jsonWebToken.verify(token, String(process.env.JWT_SECRET));
    } catch (error: Error | unknown) {
        return null;
    }
};

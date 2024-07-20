import { z, ZodType } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        email: z.string().email(),
        username: z.string().min(1).max(100),
        password: z.string().min(1).max(100),
    });

    static readonly LOGIN: ZodType = z.object({
        email: z.string().email(),
        password: z.string(),
    });

    static readonly UPDATE_USER_PROFILE: ZodType = z.object({
        username: z.string().min(1).max(100),
    });

    static readonly CREATE_USER_WITH_ROLE = z.object({
        email: z.string().email(),
        username: z.string().min(1).max(100),
        password: z.string().min(1).max(100),
        role: z.string(),
    });

    static readonly UPDATE_USER_ROLE = z.object({
        role: z.string(),
    });

    static readonly UPDATE_PASSWORD = z.object({
        password: z.string().min(1).max(100),
    });
}

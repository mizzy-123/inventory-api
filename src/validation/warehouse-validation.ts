import { z } from "zod";

export class WarehouseValidation {
    static readonly CREATE_WAREHOUSE = z.object({
        name: z.string().min(1).max(100),
        location: z.string().min(1).max(255),
    });

    static readonly UPDATE_WAREHOUSE = z.object({
        id: z.number(),
        name: z.string().min(1).max(100),
        location: z.string().min(1).max(255),
    });
}

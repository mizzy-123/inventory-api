import { z } from "zod";

export class ItemValidation {
    static readonly CREATE_ITEM = z.object({
        supplier_id: z.number(),
        name: z.string().min(1).max(100),
        quantity: z.number(),
    });

    static readonly UPDATE_ITEM = z.object({
        id: z.number(),
        name: z.string().min(1).max(100),
        quantity: z.number(),
    });
}

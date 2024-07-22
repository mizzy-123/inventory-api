import { z } from "zod";

export class InventoryValidation {
    static readonly CREATE_INVENTORY = z.object({
        warehouse_id: z.number(),
        item_id: z.number(),
        quantity: z.number(),
        description: z.string().min(1).max(255),
    });

    static readonly TRANSFER_INVENTORY = z.object({
        id: z.number(),
        quantity: z.number(),
        description: z.string().min(1).max(255),
    });
}

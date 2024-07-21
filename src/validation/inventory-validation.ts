import { z } from "zod";

export class InventoryValidation {
    static readonly CREATE_INVENTORY = z.object({
        warehouse_id: z.number(),
        item_id: z.number(),
        quantity: z.number(),
    });
}

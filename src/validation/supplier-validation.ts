import { z } from "zod";

export class SupplierValidation {
    static readonly CREATE_SUPPLIER = z.object({
        name: z.string().min(1).max(100),
        contact_info: z.string().min(1).max(255),
    });

    static readonly UPDATE_SUPPLIER = z.object({
        id: z.number(),
        name: z.string().min(1).max(100),
        contact_info: z.string().min(1).max(255),
    });
}

import { Inventory } from "@prisma/client";
import { CreateInventory } from "../model/inventory-model";
import { ResponseError } from "../error/response-error";
import { prismaClient } from "../application/database";
import { Validation } from "../validation/validation";
import { InventoryValidation } from "../validation/inventory-validation";

export class InventoryService {
    static async createInventory(reqeust: CreateInventory): Promise<Inventory> {
        const requestInventory = Validation.validate(InventoryValidation.CREATE_INVENTORY, reqeust);

        let resultResponse: Inventory | null = null;
        try {
            await prismaClient.$transaction(async (prisma) => {
                const inventoryResponse = await prisma.inventory.create({
                    data: {
                        item_id: requestInventory.item_id,
                        warehouse_id: requestInventory.warehouse_id,
                        quantity: requestInventory.quantity,
                    },
                });

                const totalQuantity = await prisma.inventory.aggregate({
                    _sum: {
                        quantity: true,
                    },
                    where: {
                        item_id: requestInventory.item_id,
                    },
                });

                const item = await prisma.item.findUnique({
                    where: {
                        id: requestInventory.item_id,
                    },
                    select: {
                        quantity: true,
                    },
                });

                if (!item) {
                    throw new Error("Cannot find match the item");
                }

                if (totalQuantity._sum.quantity || 0 > item.quantity) {
                    throw new Error(`Your quantity total inventory is ${totalQuantity._sum.quantity || 0} cannot greater than ${item.quantity}`);
                }

                resultResponse = inventoryResponse;
            });
        } catch (error) {
            throw new ResponseError(500, `Failed to add inventory ${String((error as Error).message)}`);
        }

        if (!resultResponse) {
            throw new ResponseError(500, `Failed to add inventory`);
        }

        return resultResponse;
    }
}

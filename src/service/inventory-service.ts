import { Inventory } from "@prisma/client";
import { ResponseError } from "../error/response-error";
import { prismaClient } from "../application/database";
import { Validation } from "../validation/validation";
import { InventoryValidation } from "../validation/inventory-validation";
import { UserResponse } from "../model/user-model";
import { CreateInventoryRequest, GetAllInventoryResponse, TransactionInventoryRequest, TransferInventoryRequest } from "../model/inventory-model";

export class InventoryService {
    static async createInventory(request: CreateInventoryRequest, user: UserResponse | undefined): Promise<Inventory> {
        const requestInventory = Validation.validate(InventoryValidation.CREATE_INVENTORY, request);

        if (!user) {
            throw new ResponseError(401, `You are not authenticated`);
        }

        let resultResponse: Inventory | null = null;
        try {
            await prismaClient.$transaction(async (prisma) => {
                const existingInventory = await prisma.inventory.findFirst({
                    where: {
                        item_id: requestInventory.item_id,
                        warehouse_id: requestInventory.warehouse_id,
                    },
                });

                let inventoryResponse: Inventory;

                if (!existingInventory) {
                    inventoryResponse = await prisma.inventory.create({
                        data: {
                            item_id: requestInventory.item_id,
                            warehouse_id: requestInventory.warehouse_id,
                            quantity: requestInventory.quantity,
                        },
                    });
                } else {
                    inventoryResponse = await prisma.inventory.update({
                        where: {
                            id: existingInventory.id,
                        },
                        data: {
                            item_id: requestInventory.item_id,
                            warehouse_id: requestInventory.warehouse_id,
                            quantity: existingInventory.quantity + requestInventory.quantity,
                        },
                    });
                }

                const [totalQuantity, item] = await Promise.all([
                    prisma.inventory.aggregate({
                        _sum: {
                            quantity: true,
                        },
                        where: {
                            item_id: requestInventory.item_id,
                        },
                    }),
                    prisma.item.findUnique({
                        where: {
                            id: requestInventory.item_id,
                        },
                        select: {
                            quantity: true,
                        },
                    }),
                ]);

                // await Promise.all([
                //     prisma.item.update({
                //         where: {
                //             id: requestInventory.item_id,
                //         },
                //         data: {
                //             quantity: {
                //                 decrement: requestInventory.quantity,
                //             },
                //         },
                //     }),
                //     prisma.inbound.create({
                //         data: {
                //             item_id: requestInventory.item_id,
                //             warehouse_id: requestInventory.warehouse_id,
                //             users_id: user.id,
                //             quantity: requestInventory.quantity,
                //         },
                //     }),
                // ]);

                await prisma.inbound.create({
                    data: {
                        item_id: requestInventory.item_id,
                        warehouse_id: requestInventory.warehouse_id,
                        users_id: user.id,
                        quantity: requestInventory.quantity,
                        description: requestInventory.description,
                    },
                });

                if (!item) {
                    throw new Error("Cannot find match the item");
                }

                if ((totalQuantity._sum.quantity || 0) > item.quantity) {
                    console.log(`sum: ${totalQuantity._sum.quantity}, item: ${item.quantity}`);
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

    static async getAllInventory(): Promise<GetAllInventoryResponse[]> {
        const getDataInventory = await prismaClient.inventory.findMany({
            include: {
                item: true,
                warehouse: true,
            },
            orderBy: {
                id: "desc",
            },
        });

        const resultDataInventory: GetAllInventoryResponse[] = getDataInventory.map((v) => ({
            id: v.id,
            quantity: v.quantity,
            created_at: v.created_at,
            updated_at: v.updated_at,
            warehouse_id: v.warehouse_id,
            item_id: v.item_id,
            item: {
                id: v.item.id,
                name: v.item.name,
                code: v.item.code,
                quantity: v.item.quantity,
                created_at: v.item.created_at,
                updated_at: v.item.updated_at,
                supplier_id: v.item.supplier_id,
            },
            warehouse: {
                id: v.warehouse.id,
                name: v.warehouse.name,
                location: v.warehouse.location,
                created_at: v.warehouse.created_at,
                updated_at: v.warehouse.updated_at,
            },
        }));

        return resultDataInventory;
    }

    static async transferInventory(request: TransferInventoryRequest, user: UserResponse | undefined): Promise<Inventory> {
        const requestInventory = Validation.validate(InventoryValidation.TRANSFER_INVENTORY, request);

        if (!user) {
            throw new ResponseError(401, `You are not authenticated`);
        }

        let inventoryResponse: Inventory | null = null;

        try {
            await prismaClient.$transaction(async (prisma) => {
                const quantityInventory = await prisma.inventory.findUnique({
                    where: {
                        id: requestInventory.id,
                    },
                });

                if (!quantityInventory) {
                    throw new Error(`Cannot find inventory specifictly`);
                }

                if ((quantityInventory?.quantity || 0) < requestInventory.quantity) {
                    throw new Error(`Quantity current inventory is ${quantityInventory?.quantity || 0} cannot greater than ${requestInventory.quantity}`);
                }

                const result1 = await prisma.inventory.update({
                    where: {
                        id: requestInventory.id,
                    },
                    data: {
                        quantity: {
                            decrement: requestInventory.quantity,
                        },
                    },
                });

                const result2 = await prisma.inventory.findFirst({
                    where: {
                        warehouse_id: requestInventory.warehouse_id,
                        item_id: quantityInventory.item_id,
                    },
                });

                if (!result2) {
                    throw new Error(`Cannot find warehouse destination`);
                }

                inventoryResponse = await prisma.inventory.update({
                    where: {
                        id: result2.id,
                    },
                    data: {
                        quantity: {
                            increment: requestInventory.quantity,
                        },
                    },
                });

                await Promise.all([
                    prisma.inbound.create({
                        data: {
                            description: requestInventory.description,
                            item_id: inventoryResponse.item_id,
                            warehouse_id: inventoryResponse.warehouse_id,
                            quantity: requestInventory.quantity,
                            users_id: user.id,
                        },
                    }),
                    prisma.outbound.create({
                        data: {
                            description: requestInventory.description,
                            item_id: result1.item_id,
                            warehouse_id: result1.warehouse_id,
                            quantity: requestInventory.quantity,
                            users_id: user.id,
                        },
                    }),
                ]);
            });
        } catch (error) {
            throw new ResponseError(500, `Failed to update inventory ${String((error as Error).message)}`);
        }

        if (!inventoryResponse) {
            throw new ResponseError(500, `Failed to update inventory`);
        }

        return inventoryResponse;
    }

    static async transactionInventory(request: TransactionInventoryRequest, user: UserResponse | undefined): Promise<Inventory> {
        if (!user) {
            throw new ResponseError(401, `You are not authenticated`);
        }

        const requestTransaction = Validation.validate(InventoryValidation.TRANSACTION_INVENTORY, request);

        const findInventory = await prismaClient.inventory.findUnique({
            where: {
                id: requestTransaction.id,
            },
            include: {
                item: true,
                warehouse: true,
            },
        });

        if (!findInventory) {
            throw new ResponseError(500, "Cannot find inventory");
        }

        let resultResponse: Inventory | null = null;

        try {
            await prismaClient.$transaction(async (prisma) => {
                const resultItem = await prisma.item.update({
                    where: {
                        id: findInventory.item.id,
                    },
                    data: {
                        quantity: {
                            decrement: requestTransaction.quantity,
                        },
                    },
                });

                if (resultItem.quantity < 0) {
                    throw new Error("Insufficient stock");
                }

                const resultInventory = await prisma.inventory.update({
                    where: {
                        id: requestTransaction.id,
                    },
                    data: {
                        quantity: {
                            decrement: requestTransaction.quantity,
                        },
                    },
                });

                if (resultInventory.quantity < 0) {
                    throw new Error(`Insufficient stock on warehouse ${findInventory.warehouse.name}`);
                }

                await prisma.outbound.create({
                    data: {
                        item_id: resultInventory.item_id,
                        users_id: user.id,
                        warehouse_id: resultInventory.warehouse_id,
                        description: requestTransaction.description,
                        quantity: requestTransaction.quantity,
                    },
                });

                resultResponse = resultInventory;
            });
        } catch (error) {
            throw new ResponseError(500, `Failed to transaction inventory ${String((error as Error).message)}`);
        }

        if (!resultResponse) {
            throw new ResponseError(500, `Failed to transaction inventory`);
        }

        return resultResponse;
    }
}

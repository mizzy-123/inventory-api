import { Item } from "@prisma/client";
import { CreateItemRequest, GetAllItemResponse, UpdateItemRequest } from "../model/item-model";
import { Validation } from "../validation/validation";
import { ItemValidation } from "../validation/item-validation";
import { prismaClient } from "../application/database";

export class ItemService {
    static async createItem(request: CreateItemRequest): Promise<Item> {
        const requestItem = Validation.validate(ItemValidation.CREATE_ITEM, request);

        const lastItem = await prismaClient.item.findFirst({
            orderBy: {
                id: "desc",
            },
            select: {
                code: true,
            },
        });

        const newCode = lastItem ? `BA-${parseInt(lastItem.code.split("-")[1]) + 1}` : "BA-1";

        const itemResponse = prismaClient.item.create({
            data: {
                supplier_id: requestItem.supplier_id,
                name: requestItem.name,
                code: newCode,
                quantity: requestItem.quantity,
            },
        });

        return itemResponse;
    }

    static async updateItem(request: UpdateItemRequest): Promise<Item> {
        const requestItem = Validation.validate(ItemValidation.UPDATE_ITEM, request);

        const itemResponse = await prismaClient.item.update({
            where: {
                id: requestItem.id,
            },
            data: {
                name: requestItem.name,
                quantity: requestItem.quantity,
            },
        });

        return itemResponse;
    }

    static async getAllItem(): Promise<GetAllItemResponse[]> {
        const itemResponse = await prismaClient.item.findMany({
            include: {
                supplier: true,
            },
        });

        const result: GetAllItemResponse[] = itemResponse.map((v) => ({
            id: v.id,
            name: v.name,
            code: v.code,
            quantity: v.quantity,
            supplier: {
                id: v.supplier.id,
                name: v.supplier.name,
                contact_info: v.supplier.contact_info,
            },
        }));

        return result;
    }

    static async deleteItem(id: number): Promise<Item> {
        const itemResponse = await prismaClient.item.delete({
            where: {
                id: id,
            },
        });

        return itemResponse;
    }
}

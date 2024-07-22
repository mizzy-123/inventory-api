import { NextFunction, Response } from "express";
import { AuthenticateRequest } from "../types/authenticatedRequest";
import { CreateItemRequest, UpdateItemRequest } from "../model/item-model";
import { ItemService } from "../service/item-service";
import JSONbig from "json-bigint";

const JSONBigInt = JSONbig({ useNativeBigInt: true });

export class ItemController {
    static async createItem(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateItemRequest = req.body as CreateItemRequest;
            const response = await ItemService.createItem(request);

            res.status(201).json({
                message: "New item has been created",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateItem(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateItemRequest = req.body as UpdateItemRequest;
            request.id = Number(req.params.id);
            const response = await ItemService.updateItem(request);

            res.status(201).json({
                message: "Update item succesfull",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllItem(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const response = await ItemService.getAllItem();
            res.status(200).json({
                message: "Get all item succesfull",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteItem(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const response = await ItemService.deleteItem(Number(req.params.id));

            res.status(200).json({
                message: `Delete item ${response.name} succesfull`,
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }
}

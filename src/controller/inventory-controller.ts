import { NextFunction, Response } from "express";
import { AuthenticateRequest } from "../types/authenticatedRequest";
import { InventoryService } from "../service/inventory-service";
import { CreateInventoryRequest, TransferInventoryRequest } from "../model/inventory-model";
import JSONbig from "json-bigint";

const JSONBigInt = JSONbig({ useNativeBigInt: true });

export class InventoryController {
    static async createInventory(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateInventoryRequest = req.body as CreateInventoryRequest;
            const response = await InventoryService.createInventory(request, req.user);

            res.status(201).json({
                message: "New inventory has been created",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }

    static async transferInventory(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: TransferInventoryRequest = req.body as TransferInventoryRequest;
            request.id = Number(req.params.id);
            const response = await InventoryService.transferInventory(request, req.user);

            res.status(201).json({
                message: "Update inventory succesfull",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }
}

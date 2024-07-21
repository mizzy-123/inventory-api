import { NextFunction, Response } from "express";
import { AuthenticateRequest } from "../types/authenticatedRequest";
import { CreateInventory } from "../model/inventory-model";
import { InventoryService } from "../service/inventory-service";

export class InventoryController {
    static async createInventory(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateInventory = req.body as CreateInventory;
            const response = InventoryService.createInventory(request);

            res.status(201).json({
                message: "New inventory has been created",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }
}

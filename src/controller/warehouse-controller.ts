import { NextFunction, Response } from "express";
import { AuthenticateRequest } from "../types/authenticatedRequest";
import { CreateWarehouseRequest, UpdateWarehouseRequest } from "../model/warehouse-model";
import { WarehouseService } from "../service/warehouse-service";
import JSONbig from "json-bigint";

const JSONBigInt = JSONbig({ useNativeBigInt: true });

export class WarehouseController {
    static async createWarehouse(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateWarehouseRequest = req.body as CreateWarehouseRequest;
            const response = await WarehouseService.createWarehouse(request);

            res.status(201).json({
                message: "Warehouse has been created",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }

    static async getWarehouse(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const response = await WarehouseService.getWarehouse();
            res.status(200).json({
                message: "Get data warehouse successfull",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateWarehouse(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateWarehouseRequest = req.body as UpdateWarehouseRequest;
            request.id = Number(req.params.id);
            const response = await WarehouseService.updateWarehouse(request);

            res.status(200).json({
                message: "Update warehouse successfull",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteWarehouse(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const response = await WarehouseService.deleteWarehouse(Number(req.params.id));

            res.status(200).json({
                message: "Delete warehouse successfull",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }
}

import { NextFunction, Response } from "express";
import { AuthenticateRequest } from "../types/authenticatedRequest";
import { CreateSupplierRequest, UpdateSupplierRequest } from "../model/supplier-model";
import { SupplierService } from "../service/supplier-service";
import JSONbig from "json-bigint";

const JSONBigInt = JSONbig({ useNativeBigInt: true });

export class SupplierController {
    static async CreateSupplier(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateSupplierRequest = req.body as CreateSupplierRequest;
            const response = await SupplierService.CreateSupplier(request);

            res.status(201).json({
                message: "New supplier has been created",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }

    static async UpdateSupplier(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateSupplierRequest = req.body as UpdateSupplierRequest;
            request.id = Number(req.params.id);
            const response = await SupplierService.UpdateSupplier(request);

            res.status(201).json({
                message: "Update supplier successfull",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }
}

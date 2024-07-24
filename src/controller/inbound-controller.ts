import { NextFunction, Response } from "express";
import { AuthenticateRequest } from "../types/authenticatedRequest";
import { InboundService } from "../service/inbound-service";
import JSONbig from "json-bigint";

const JSONBigInt = JSONbig({ useNativeBigInt: true });

export class InboundController {
    static async getAllInbound(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const response = await InboundService.getAllInbound();

            res.status(200).json({
                message: "Get all data inbound successfull",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }
}

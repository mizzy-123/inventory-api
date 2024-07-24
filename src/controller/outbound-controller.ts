import { NextFunction, Response } from "express";
import { AuthenticateRequest } from "../types/authenticatedRequest";
import JSONbig from "json-bigint";
import { InboundService } from "../service/inbound-service";

const JSONBigInt = JSONbig({ useNativeBigInt: true });

export class OutboundController {
    static async getAllOutbound(req: AuthenticateRequest, res: Response, next: NextFunction) {
        try {
            const response = await InboundService.getAllInbound();

            res.status(200).json({
                message: "Get all data outbound successfull",
                data: JSONBigInt.parse(JSONBigInt.stringify(response)),
            });
        } catch (error) {
            next(error);
        }
    }
}

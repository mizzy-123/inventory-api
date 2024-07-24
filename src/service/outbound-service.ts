import { prismaClient } from "../application/database";
import { GetAllOutboundResponse } from "../model/outbound-model";

export class OutboundService {
    static async getAllOutbond(): Promise<GetAllOutboundResponse[]> {
        const outboundResponse = await prismaClient.outbound.findMany({
            include: {
                item: true,
                users: true,
                warehouse: true,
            },
            orderBy: {
                id: "desc",
            },
        });
        return outboundResponse;
    }
}

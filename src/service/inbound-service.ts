import { prismaClient } from "../application/database";
import { GetAllInboundResponse } from "../model/inbound-model";

export class InboundService {
    static async getAllInbound(): Promise<GetAllInboundResponse[]> {
        const inboundResponse = await prismaClient.inbound.findMany({
            include: {
                users: true,
                item: true,
                warehouse: true,
            },
            orderBy: {
                id: "desc",
            },
        });

        return inboundResponse;
    }
}

import { Warehouse } from "@prisma/client";
import { CreateWarehouseRequest, UpdateWarehouseRequest } from "../model/warehouse-model";
import { Validation } from "../validation/validation";
import { WarehouseValidation } from "../validation/warehouse-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class WarehouseService {
    static async createWarehouse(request: CreateWarehouseRequest): Promise<Warehouse> {
        const requestWarehouse = Validation.validate(WarehouseValidation.CREATE_WAREHOUSE, request);

        const warehouseResponse = await prismaClient.warehouse.create({
            data: {
                name: requestWarehouse.name,
                location: requestWarehouse.location,
            },
        });

        return warehouseResponse;
    }

    static async getWarehouse(): Promise<Warehouse[]> {
        const warehouseResponse = await prismaClient.warehouse.findMany();

        return warehouseResponse;
    }

    static async updateWarehouse(request: UpdateWarehouseRequest): Promise<Warehouse> {
        const requestWarehouse = Validation.validate(WarehouseValidation.UPDATE_WAREHOUSE, request);

        const warehouseResponse = await prismaClient.warehouse.update({
            where: {
                id: requestWarehouse.id,
            },
            data: {
                name: requestWarehouse.name,
                location: requestWarehouse.location,
            },
        });

        return warehouseResponse;
    }

    static async deleteWarehouse(id: number): Promise<Warehouse> {
        if (!id) {
            throw new ResponseError(400, "Params id undefined");
        }

        const warehouseResponse = await prismaClient.warehouse.delete({
            where: {
                id: id,
            },
        });

        return warehouseResponse;
    }
}

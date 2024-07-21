import { Supplier } from "@prisma/client";
import { CreateSupplierRequest, UpdateSupplierRequest } from "../model/supplier-model";
import { Validation } from "../validation/validation";
import { SupplierValidation } from "../validation/supplier-validation";
import { prismaClient } from "../application/database";

export class SupplierService {
    static async CreateSupplier(request: CreateSupplierRequest): Promise<Supplier> {
        const supplierRequest = Validation.validate(SupplierValidation.CREATE_SUPPLIER, request);

        const supplierResponse = await prismaClient.supplier.create({
            data: {
                name: supplierRequest.name,
                contact_info: supplierRequest.contact_info,
            },
        });

        return supplierResponse;
    }

    static async getSupplier(): Promise<Supplier[]> {
        const supplierResponse = await prismaClient.supplier.findMany();
        return supplierResponse;
    }

    static async UpdateSupplier(request: UpdateSupplierRequest): Promise<Supplier> {
        const supplierRequest = Validation.validate(SupplierValidation.UPDATE_SUPPLIER, request);

        const supplierResponse = await prismaClient.supplier.update({
            where: {
                id: supplierRequest.id,
            },
            data: {
                name: supplierRequest.name,
                contact_info: supplierRequest.contact_info,
            },
        });

        return supplierResponse;
    }
}

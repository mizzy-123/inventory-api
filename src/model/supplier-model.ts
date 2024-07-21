export type CreateSupplierRequest = {
    name: string;
    contact_info: string;
};

export type UpdateSupplierRequest = {
    id: number;
    name: string;
    contact_info: string;
};

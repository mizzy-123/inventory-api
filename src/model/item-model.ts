export type CreateItemRequest = {
    supplier_id: number;
    name: string;
    quantity: number;
};

export type UpdateItemRequest = {
    id: number;
    supplier_id: number;
    name: string;
    quantity: number;
};

export type GetAllItemResponse = {
    id: bigint;
    name: string;
    code: string;
    quantity: number;
    supplier: {
        id: bigint;
        name: string;
        contact_info: string;
    };
};

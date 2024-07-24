export type CreateInventoryRequest = {
    item_id: number;
    warehouse_id: number;
    quantity: number;
    description: string;
};

export type TransferInventoryRequest = {
    id: number;
    warehouse_id: number;
    quantity: number;
    description: string;
};

export type TransactionInventoryRequest = {
    id: number;
    quantity: number;
    description: string;
};

export type GetAllInventoryResponse = {
    id: bigint;
    quantity: number;
    created_at: Date;
    updated_at: Date;
    warehouse_id: bigint;
    item_id: bigint;
    item: {
        id: bigint;
        name: string;
        code: string;
        quantity: number;
        created_at: Date;
        updated_at: Date;
        supplier_id: bigint;
    };
    warehouse: {
        id: bigint;
        name: string;
        location: string;
        created_at: Date;
        updated_at: Date;
    };
};

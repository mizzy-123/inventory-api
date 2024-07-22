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

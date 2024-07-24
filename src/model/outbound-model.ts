export type GetAllOutboundResponse = {
    id: bigint;
    item_id: bigint;
    users_id: string;
    warehouse_id: bigint;
    quantity: number;
    description: string;
    createdAt: Date;
    item: {
        id: bigint;
        name: string;
        code: string;
        quantity: number;
        created_at: Date;
        updated_at: Date;
        supplier_id: bigint;
    };
    users: {
        id: string;
        email: string;
        username: string;
        password: string;
        created_at: Date;
        updated_at: Date;
    };
    warehouse: {
        id: bigint;
        name: string;
        location: string;
        created_at: Date;
        updated_at: Date;
    };
};

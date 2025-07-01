import { Order } from "./Order";

export interface Client {
    client_id?: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    created_at?: Date;
    status: 'Active' | 'Inactive';
    company?: string;
    notes?: string;

    orders?: Order[];
}

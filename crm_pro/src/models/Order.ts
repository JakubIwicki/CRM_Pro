import { Service } from './Service';
import { Product } from './Product';

export interface Order {
    order_id?: number;
    client_id: number;
    order_date?: Date;
    status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
    total_amount?: number;
    title?: string | null;
    priority: 'Low' | 'Medium' | 'High';
    due_date?: Date;
    created_date: Date;
    description?: string;

    services: Service[];
    products: Product[];
}

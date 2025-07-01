import { Service } from './Service';
import { Product } from './Product';

export class Order {
    order_id?: number;
    client_id!: number;
    order_date?: Date;
    total_amount?: number;

    services: Service[] = [];
    products: Product[] = [];
}

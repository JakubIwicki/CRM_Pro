export class Product {
    product_id?: number;
    name!: string;
    type!: 'Digital' | 'Service' | 'Hardware';
    price?: number;
}

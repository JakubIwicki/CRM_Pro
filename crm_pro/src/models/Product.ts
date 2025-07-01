export interface Product {
    product_id?: number;
    name: string;
    type: 'Digital' | 'Service' | 'Hardware'
    description?: string;
    price?: number;
    stock: number;
}

import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { ApiGet, ApiPost } from "./api_utils";

export async function getProducts(user: User): Promise<Product[] | Error> {
    try {
        const response = await ApiGet<Product[]>(
            '/api/products', user.token
        );

        if (response instanceof Error) {
            return response; // Propagate the error
        }
        return response as Product[];
    } catch (error) {
        return error as Error;
    }
}

export async function postProduct(
    user: User,
    product: Product
): Promise<Product | Error> {
    try {
        const response = await ApiPost<Product, Product>(
            '/api/products', product, user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to post product`);
        }

        return response as Product;
    } catch (error) {
        return error as Error;
    }
}
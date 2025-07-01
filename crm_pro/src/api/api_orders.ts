import { User } from "@/models/User";
import { ApiGet, ApiPost } from "./api_utils";
import { Order } from "@/models/Order";

export async function getOrders(user: User): Promise<Order[] | Error> {
    try {
        const result = await ApiGet('/api/orders', user.token)
        if (result instanceof Error) {
            throw new Error(`Failed to fetch orders.`);
        }
        return result as Order[];
    } catch (error) {
        return error as Error;
    }
}

export async function postOrder(user: User, order: Order): Promise<Order | Error> {
    try {
        const response = await ApiPost<Order, Order>(
            '/api/orders', order, user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to post order.`);
        }

        return response as Order;
    } catch (error) {
        return error as Error;
    }
}
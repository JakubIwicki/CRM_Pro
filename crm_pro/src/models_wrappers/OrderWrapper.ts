import { Client } from "@/models/Client";
import { Order } from "@/models/Order";

export interface OrderWrapper {
    order: Order;
    client: Client | null;
}
import { Client } from "@/models/Client";
import { Order } from "@/models/Order";

export interface DashboardData {
    totalClients: number,
    activeOrders: number,
    totalServices: number,
    revenue: number,
    recentClients: Client[],
    recentOrders: Order[],
}
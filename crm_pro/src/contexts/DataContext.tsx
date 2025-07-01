import { Client } from "@/models/Client";
import { Order } from "@/models/Order";
import { Service } from "@/models/Service";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getClients } from "@/api/api_clients";
import { DashboardData } from "@/models_wrappers/DashboardData";
import { getDashboardData } from "@/api/api_dashboard_data";
import { getServices } from "@/api/api_services";
import { Product } from "@/models/Product";
import { getProducts } from "@/api/api_products";
import { getOrders } from "@/api/api_orders";

interface DataContextType {
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    orders: Order[];
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
    services: Service[];
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;

    dashboardData: DashboardData | null;

    fetchClients: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    fetchServices: () => Promise<void>;
    fetchProducts: () => Promise<void>;
    fetchDashboardData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [dashboardData, setDashboardData] = useState<DashboardData>(null);

    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (!user) {
            reset();
            return;
        }

        fetchDashboardData();
    }, [user]);

    const reset = () => {
        setClients([]);
        setOrders([]);
        setServices([]);
        setDashboardData(null);
    };

    const fetchClients = async () => {
        const result = await getClients(user);
        if (result instanceof Error) {
            toast({
                title: 'Error',
                description: result.message || 'Failed to fetch clients.',
                variant: 'destructive',
            });
            setClients([]);
            return;
        }
        setClients(result as Client[]);
    };

    const fetchOrders = async () => {
        const result = await getOrders(user);
        if (result instanceof Error) {
            toast({
                title: 'Error',
                description: result.message || 'Failed to fetch orders.',
                variant: 'destructive',
            });
            setOrders([]);
            return;
        }
        setOrders(result as Order[]);
    };

    const fetchServices = async () => {
        const result = await getServices(user);
        if (result instanceof Error) {
            toast({
                title: 'Error',
                description: result.message || 'Failed to fetch services.',
                variant: 'destructive',
            });
            setServices([]);
            return;
        }
        setServices(result as Service[]);
    };

    const fetchProducts = async () => {
        const result = await getProducts(user);
        if (result instanceof Error) {
            toast({
                title: 'Error',
                description: result.message || 'Failed to fetch products.',
                variant: 'destructive',
            });
            setProducts([]);
            return;
        }
        setProducts(result as Product[]);
    };

    const fetchDashboardData = async () => {
        const response = await getDashboardData(user);
        if (response instanceof Error) {
            toast({
                title: 'Error',
                description: response.message || 'Failed to fetch dashboard data.',
                variant: 'destructive',
            });
            setDashboardData(null);
            return;
        }
        setDashboardData(response as DashboardData);
    };

    return (
        <DataContext.Provider value={{ clients, setClients, orders, setOrders, services, setServices, products, setProducts, dashboardData, fetchClients, fetchOrders, fetchServices, fetchProducts, fetchDashboardData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = React.useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataContextProvider");
    }
    return context;
}
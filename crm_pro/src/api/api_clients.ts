import { Client } from "@/models/Client";
import { ApiGet, ApiPost } from "./api_utils";
import { User } from "@/models/User";

export async function getClients(user: User): Promise<Client[] | Error> {
    try {
        const response = await ApiGet<Client[]>(
            '/api/clients', user.token);

        if (response instanceof Error) {
            throw new Error(`Failed to fetch clients.`);
        }

        return response as Client[];
    } catch (error) {
        return error as Error;
    }
}

export async function postClient(
    user: User,
    client: Client
): Promise<Client | Error> {
    try {
        const response = await ApiPost<Client, Client>(
            '/api/clients', client, user.token);

        if (response instanceof Error) {
            throw new Error(`Failed to post client.`);
        }

        return response as Client;
    } catch (error) {
        return error as Error;
    }
}
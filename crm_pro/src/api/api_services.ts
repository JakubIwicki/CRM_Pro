import { Service } from "@/models/Service";
import { ApiGet, ApiPost } from "./api_utils";
import { User } from "@/models/User";

export async function getServices(user: User): Promise<Service[] | Error> {
    try {
        const response = await ApiGet<Service[]>(
            '/api/services', user.token
        );

        if (response instanceof Error) {
            throw response; // Propagate the error
        }

        return response as Service[];
    } catch (error) {
        //console.error('Error fetching services:', error);
        return error;
    }
}


export async function postService(
    user: User,
    service: Service
): Promise<Service | Error> {
    try {
        const response = await ApiPost<Service, Service>(
            '/api/services', service, user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to post service`);
        }

        return response as Service;
    } catch (error) {
        return error;
    }
}
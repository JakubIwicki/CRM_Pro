import { User } from "@/models/User";
import { DashboardData } from "@/models_wrappers/DashboardData";
import { ApiGet } from "./api_utils";

export async function getDashboardData(user: User): Promise<DashboardData | Error> {

    try {
        const response = await ApiGet(
            '/api/info/dashboard', user.token!);

        return response as DashboardData;
    }
    catch (error) {
        return error as Error;
    }
}
import { User } from '@/models/User';
import { ApiGet, ApiPost } from './api_utils';

export async function user_login(email: string, password: string): Promise<User | Error> {
    try {
        const response = await ApiPost<any, any>(
            'api/auth/login',
            {
                email: email,
                password: password
            });

        const data = response;
        //console.log(data);

        const token = data.token;
        const user = data.user as User;
        user.token = token;

        return user as User;
    }
    catch (error) {
        return error as Error;
    }
}

export async function isLoggedIn(user: User): Promise<boolean> {
    try {
        const response = await ApiGet<any>(`/api/auth/me`, user.token);

        if (response instanceof Error) {
            return false;
        }

        return response.validToken as boolean;
    }
    catch (error) {
        return false;
    }
}
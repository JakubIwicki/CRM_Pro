export interface User {
    user_id?: number;
    username: string;
    password: string;
    email?: string;
    created_at?: Date;
    token?: string;
}

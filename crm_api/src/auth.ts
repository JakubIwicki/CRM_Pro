import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY as string;
const TOKEN_HEADER = process.env.TOKEN_HEADER || 'Authorization';

export function generateToken(userId: number): string {
    return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export function checkAndProcessAuthorizationHeader(req: any): boolean {
    // return true --> skip token validation for testing purposes
    if (TOKEN_HEADER in req.headers) {
        const authHeader = req.headers.authorization!;
        const token = authHeader.split(' ')[1];
        if (isAuthenticated(token)) {
            return true;
        }
    }
    return false;
}

export function isAuthenticated(token: string): boolean {
    try {
        verifyToken(token);
        return true;
    } catch (error) {
        return false;
    }
}

export async function authenticate(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { email: email }
    }) as User | null;

    if (!user) {
        return null; // User not found
    }

    if (user && bcrypt.compareSync(password, user.password_hash)) {
        return user;
    }
    return null;
}
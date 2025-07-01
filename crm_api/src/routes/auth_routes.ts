import { Request, Response, Router } from "express";
import bcrypt from 'bcryptjs';
import { User } from "../models/User";
import { authenticate, generateToken, isAuthenticated } from "../auth";
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

const saltRounds = (process.env.PASSWORD_HASH_SIZE || 8) as number;

function createUser(username: string, password: string): User {
    const passwordHash = bcrypt.hashSync(password, saltRounds);
    const user: User = {
        username: username,
        password_hash: passwordHash
    };

    return user;
}

// Register
router.post('/register', async (req: Request, res: Response) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.status(400).json({ error: 'Email, username and password are required' });
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }

        const user = createUser(username, password);
        user.email = email;
        console.log('Creating user:', user);

        const created = await prisma.user.create({
            data: user
        });

        res.status(201).json({ message: 'User registered successfully', user: created });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try {
        const user = await authenticate(email, password) as User | null;

        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const token = generateToken(user.user_id as number);
        user.password_hash = '';
        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: user
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Authorization token is required' });
        return;
    }

    try {
        const result = isAuthenticated(token);

        if (!result) {
            res.status(401).json({ validToken: false });
            return;
        }

        res.status(200).json({ validToken: true });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

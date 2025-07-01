import { Request, Response, Router } from "express";
import { checkAndProcessAuthorizationHeader } from "../auth";
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

// Helper function to validate user data
function validateUserData(data: any): { valid: boolean, message?: string } {
    if (!data.username) {
        return { valid: false, message: 'Username is required' };
    }
    if (!data.password) {
        return { valid: false, message: 'Password is required' };
    }
    return { valid: true };
}

// users
router.get('/', async (req: Request, res: Response) => {
    if (!checkAndProcessAuthorizationHeader(req)) {
        res.status(401).json({ error: 'Unauthorized access' });
        return;
    }

    // const userId = verifyToken(token) as number;
    // if (!userId) {
    //     res.status(401).json({ error: 'Invalid token' });
    //     return;
    // }

    // const user = await prisma.user.findUnique({
    //     where: { user_id: userId }
    // }) as User | null;

    // if (!user) {
    //     res.status(404).json({ error: 'User not found' });
    //     return;
    // }

    // // Check if admin and return all users
    // res.status(200).json({});
});

export default router;
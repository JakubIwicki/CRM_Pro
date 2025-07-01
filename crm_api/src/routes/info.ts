import express from 'express';
import { OrderStatus, PrismaClient } from '@prisma/client';
import { checkAndProcessAuthorizationHeader } from '../auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/dashboard', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const totalClients = await prisma.client.count();
        const activeOrders = await prisma.order.count({
            where: { status: OrderStatus.Pending }
        });

        const totalServices = await prisma.service.count();
        const revenueThisMonth = await prisma.order.aggregate({
            _sum: {
                total_amount: true
            },
            where: {
                order_date: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Start of the current month
                }
            }
        }) as { _sum: { total_amount: number | null } };

        const recentClients = await prisma.client.findMany({
            orderBy: {
                created_at: 'desc'
            },
            take: 3
        });

        const recentOrders = await prisma.order.findMany({
            orderBy: {
                order_date: 'desc'
            },
            take: 3
        });

        const dashboardData = {
            totalClients: totalClients,
            activeOrders: activeOrders,
            totalServices: totalServices,
            revenue: revenueThisMonth._sum.total_amount || 0,
            recentClients: recentClients,
            recentOrders: recentOrders
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

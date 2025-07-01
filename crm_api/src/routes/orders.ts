import express from 'express';
import { OrderPriority, OrderStatus, PrismaClient } from '@prisma/client';
import { checkAndProcessAuthorizationHeader } from '../auth';

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to validate order data
function validateOrderData(data: any): { valid: boolean, message?: string } {
    if (!data.client_id) {
        return { valid: false, message: 'Client ID is required' };
    }
    if (!data.status || !Object.values(OrderStatus).includes(data.status)) {
        return { valid: false, message: 'Valid order status is required' };
    }
    if (!data.priority || !Object.values(OrderPriority).includes(data.priority)) {
        return { valid: false, message: 'Valid order priority is required' };
    }
    return { valid: true };
}

// CREATE
router.post('/', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const validation = validateOrderData(req.body);
        if (!validation.valid) {
            res.status(400).json({ error: validation.message });
            return;
        }

        const order = await prisma.order.create({ data: req.body });
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const order = await prisma.order.update({
            where: { order_id: Number(req.params.id) },
            data: req.body,
        });
        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// READ ALL
router.get('/', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const orders = await prisma.order.findMany();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// READ ONE
router.get('/:id', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const order = await prisma.order.findUnique({
            where: { order_id: Number(req.params.id) }
        });
        order ? res.json(order) : res.status(404).json({ error: 'Not found' });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const order = await prisma.order.findUnique({
            where: { order_id: Number(req.params.id) }
        });

        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        await prisma.order.delete({ where: { order_id: Number(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(404).json({ error: 'Not found' });
    }
});

export default router;

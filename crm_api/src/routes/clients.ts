import express from 'express';
import { PrismaClient } from '@prisma/client';
import { checkAndProcessAuthorizationHeader } from '../auth';

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to validate client data
function validateClientData(data: any): { valid: boolean, message?: string } {
    if (!data.name) {
        return { valid: false, message: 'Client name is required' };
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

        const validation = validateClientData(req.body);
        if (!validation.valid) {
            res.status(400).json({ error: validation.message });
            return;
        }

        const client = await prisma.client.create({ data: req.body });
        res.json(client);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// READ ALL (with Orders)
router.get('/', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const clients = await prisma.client.findMany({
            include: {
                orders: true
            }
        });
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
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

        const client = await prisma.client.findUnique({
            where: { client_id: Number(req.params.id) }
        });
        client ? res.json(client) : res.status(404).json({ error: 'Not found' });
    } catch (error) {
        console.error('Error fetching client:', error);
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

        const clientId = Number(req.params.id);
        const existingClient = await prisma.client.findUnique({
            where: { client_id: clientId }
        });

        if (!existingClient) {
            res.status(404).json({ error: 'Not found' });
            return;
        }

        if (req.body.email && req.body.email !== existingClient.email) {
            const emailExists = await prisma.client.findUnique({
                where: { email: req.body.email }
            });
            if (emailExists) {
                res.status(409).json({ error: 'Email already in use' });
                return;
            }
        }

        const client = await prisma.client.update({
            where: { client_id: clientId },
            data: req.body,
        });
        res.json(client);
    } catch (error) {
        console.error('Error updating client:', error);
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

        const client = await prisma.client.findUnique({
            where: { client_id: Number(req.params.id) }
        });

        if (!client) {
            res.status(404).json({ error: 'Client not found' });
            return;
        }

        await prisma.client.delete({ where: { client_id: Number(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(404).json({ error: 'Not found' });
    }
});

export default router;

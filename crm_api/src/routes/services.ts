import express from 'express';
import { PrismaClient } from '@prisma/client';
import { checkAndProcessAuthorizationHeader } from '../auth';

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to validate service data
function validateServiceData(data: any): { valid: boolean, message?: string } {
    if (!data.name) {
        return { valid: false, message: 'Service name is required' };
    }
    if (!data.type) {
        return { valid: false, message: 'Service type is required' };
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

        const validation = validateServiceData(req.body);
        if (!validation.valid) {
            res.status(400).json({ error: validation.message });
            return;
        }

        const service = await prisma.service.create({ data: req.body });
        res.json(service);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).send('Internal Server Error');
    }
});

// READ ALL
router.get('/', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const services = await prisma.service.findMany();
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Internal Server Error');
    }
});

// READ ONE
router.get('/:id', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const service = await prisma.service.findUnique({
            where: { service_id: Number(req.params.id) }
        });
        service ? res.json(service) : res.status(404).json({ error: 'Not found' });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).send('Internal Server Error');
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const service = await prisma.service.update({
            where: { service_id: Number(req.params.id) },
            data: req.body,
        });
        res.json(service);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(404).json({ error: 'Not found' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        if (!checkAndProcessAuthorizationHeader(req)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const service = await prisma.service.findUnique(
            { where: { service_id: Number(req.params.id) } }
        );

        if (!service) {
            res.status(404).json({ error: 'Service not found' });
            return;
        }

        await prisma.service.delete({ where: { service_id: Number(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;

import express from 'express';
import { PrismaClient, ProductType } from '@prisma/client';
import { checkAndProcessAuthorizationHeader } from '../auth';

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to validate product data
function validateProductData(data: any): { valid: boolean, message?: string } {
    if (!data.name) {
        return { valid: false, message: 'Product name is required' };
    }
    if (!data.type || !Object.values(ProductType).includes(data.type)) {
        return { valid: false, message: 'Valid product type is required' };
    }
    if (typeof data.stock !== 'number' || data.stock < 0) {
        return { valid: false, message: 'Stock must be a non-negative number' };
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

        const validation = validateProductData(req.body);
        if (!validation.valid) {
            res.status(400).json({ error: validation.message });
            return;
        }

        const product = await prisma.product.create({ data: req.body });
        res.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
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

        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
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

        const product = await prisma.product.findUnique({
            where: { product_id: Number(req.params.id) }
        });
        product ? res.json(product) : res.status(404).json({ error: 'Not found' });
    } catch (error) {
        console.error('Error fetching product:', error);
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

        const product = await prisma.product.update({
            where: { product_id: Number(req.params.id) },
            data: req.body,
        });
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
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

        const product = await prisma.product.findUnique({
            where: { product_id: Number(req.params.id) }
        });

        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        await prisma.product.delete({ where: { product_id: Number(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
import { Router } from 'express';
import { MenuItem } from '../models';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// GET all items (optionally filter by category)
router.get('/', async (req, res) => {
    try {
        const { categoryId } = req.query;
        const filter = categoryId ? { categoryId } : {};
        const items = await MenuItem.find(filter).sort({ order: 1, createdAt: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error });
    }
});

// POST create item
router.post('/', requireAdmin, async (req, res) => {
    try {
        const item = new MenuItem(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: 'Error creating item', error });
    }
});

// PUT update item
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: 'Error updating item', error });
    }
});

// DELETE item
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
});

export default router;

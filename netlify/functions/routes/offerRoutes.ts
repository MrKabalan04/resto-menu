import { Router } from 'express';
import { Offer } from '../models';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// GET active offers
router.get('/', async (req, res) => {
    try {
        // Only return active offers that haven't expired
        const now = new Date();
        // Logic: isActive is true AND (expiresAt is null OR expiresAt > now)
        const offers = await Offer.find({
            isActive: true,
            $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: now } }, { expiresAt: null }],
        });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching offers', error });
    }
});

// GET ALL offers (for Admin)
router.get('/all', requireAdmin, async (req, res) => {
    try {
        const offers = await Offer.find();
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all offers', error });
    }
});

// POST create offer
router.post('/', requireAdmin, async (req, res) => {
    try {
        const offer = new Offer(req.body);
        await offer.save();
        res.status(201).json(offer);
    } catch (error) {
        res.status(400).json({ message: 'Error creating offer', error });
    }
});

// PUT update offer
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(offer);
    } catch (error) {
        res.status(400).json({ message: 'Error updating offer', error });
    }
});

// DELETE offer
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Offer deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting offer', error });
    }
});

export default router;

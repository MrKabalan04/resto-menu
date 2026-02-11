import { Router } from 'express';
import { Settings } from '../models';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// GET settings
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default if not exists
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error });
    }
});

// PUT update settings (Admin)
router.put('/', requireAdmin, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: 'Error updating settings', error });
    }
});

export default router;

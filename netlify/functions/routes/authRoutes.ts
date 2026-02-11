import { Router } from 'express';
import { requireAdmin } from '../middleware/auth';

import { Admin } from '../models';

const router = Router();

// Simple endpoint to verify if headers are correct
router.get('/verify', requireAdmin, (req, res) => {
    res.json({ message: 'Authenticated' });
});

// Update credentials
router.put('/update', requireAdmin, async (req, res) => {
    try {
        const { newUsername, newPassword } = req.body;
        const currentUsername = req.headers['x-admin-username'];

        const admin = await Admin.findOne({ username: currentUsername });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        if (newUsername) admin.username = newUsername;
        if (newPassword) admin.password = newPassword;

        await admin.save();
        res.json({ message: 'Credentials updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating credentials', error });
    }
});

export default router;

import { Request, Response, NextFunction } from 'express';
import { Admin } from '../models';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const username = (req.headers['x-admin-username'] as string || '').trim();
    const password = (req.headers['x-admin-password'] as string || '').trim();

    console.log(`Auth attempt for user: "${username}"`);

    if (!username || !password) {
        console.log('Auth failed: Missing credentials');
        res.status(401).json({ message: 'Unauthorized: Missing credentials' });
        return;
    }

    try {
        const admin = await Admin.findOne({ username, password });
        if (admin) {
            console.log('Auth success');
            next();
        } else {
            console.log(`Auth failed: Invalid credentials for "${username}"`);
            res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
        }
    } catch (err) {
        console.error('Auth error:', err);
        res.status(500).json({ message: 'Server error during authentication' });
    }
};


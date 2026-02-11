import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
    restaurantName: string;
    currencySymbol: string;
    lbpRate: number;
}

const SettingsSchema = new Schema({
    restaurantName: { type: String, default: 'Lava Resto' },
    currencySymbol: { type: String, default: '$' },
    lbpRate: { type: Number, default: 89500 }, // Default LBP Rate
}, { timestamps: true });

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

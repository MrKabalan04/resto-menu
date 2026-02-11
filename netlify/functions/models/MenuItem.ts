import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
    categoryId: mongoose.Types.ObjectId;
    name: string;
    nameAr: string;
    description?: string;
    descriptionAr?: string;
    price: number; // Base price
    priceCurrency: 'USD' | 'LBP'; // Currency of the base price
    imageUrl?: string;
    isAvailable: boolean;
    order?: number;
}

const MenuItemSchema = new Schema({
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    nameAr: { type: String, required: true },
    description: { type: String },
    descriptionAr: { type: String },
    price: { type: Number, required: true },
    priceCurrency: { type: String, enum: ['USD', 'LBP'], default: 'USD' },
    imageUrl: { type: String },
    isAvailable: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export const MenuItem = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

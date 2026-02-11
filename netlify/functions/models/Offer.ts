import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
    title: string;
    titleAr: string;
    description?: string;
    descriptionAr?: string;
    price?: number;
    imageUrl?: string;
    expiresAt?: Date;
    isActive: boolean;
}

const OfferSchema = new Schema({
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    description: { type: String },
    descriptionAr: { type: String },
    price: { type: Number },
    imageUrl: { type: String },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Offer = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);

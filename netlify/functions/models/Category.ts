import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    nameAr: string;
    order: number;
    createdAt: Date;
}

const CategorySchema = new Schema({
    name: { type: String, required: true },
    nameAr: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

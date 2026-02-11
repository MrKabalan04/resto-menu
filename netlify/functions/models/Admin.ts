import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
    username: string;
    password: string; // Stored as plain text for now as per project simplicity, but we can salt/hash if preferred.
}

const AdminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

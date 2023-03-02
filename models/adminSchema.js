import mongoose from 'mongoose';

const AdminSchema = mongoose.Schema({

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
}, { timestamps: true })

const adminSchema = mongoose.model('Admin', AdminSchema);
export default adminSchema;

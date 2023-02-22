import mongoose from 'mongoose';

const AdminSchema = mongoose.Schema({

    email: {
        type: String,
        trim: true,
        required: [true, 'Please enter an email'],
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Please enter a password'],
        minLength: [3, 'Minimum password length is 3 characters']
    },
}, { timestamps: true })

const adminSchema = mongoose.model('Admin', AdminSchema);
export default adminSchema;

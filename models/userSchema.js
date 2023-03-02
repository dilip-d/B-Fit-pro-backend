import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
    fname: {
        type: String,
        trim: true,
        required: true,
    },
    lname: {
        type: String,
        trim: true,
        required: true
    },
    dob: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        trim: true,
        required: true
    },
    weight: {
        type: Number,
        trim: true,
        required: true,
    },
    height: {
        type: Number,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: Number,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    address: [{
        name: { type: String },
        mobile: { type: Number },
        address: { type: String },
        country: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
    }],
    profileImage: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    wallet: {
        type: Number,
        trim: true
    },
    bookedSlots: [{
        type: Date,
        required: true
    }],
    token: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    verifyToken: {
        type: String
    }
}, { timestamps: true })

const userSchema = mongoose.model('User', UserSchema)
export default userSchema;
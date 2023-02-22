import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
    fname: {
        type: String,
        trim: true,
        required: [true, 'Please enter first name'],
        minLength: [2, 'Name is too short!']
    },
    lname: {
        type: String,
        trim: true,
        required: [true, 'Please enter last name '],
        minLength: 1
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
        minLength: 2
    },
    height: {
        type: Number,
        trim: true,
        required: true,
        minLength: 2
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Please enter an email'],
        unique: true,
        // validate: [ true,'Please enter a valid email']
    },
    phone: {
        type: Number,
        trim: true,
        required: [true, 'Please enter the phone number'],
        minLength: 10,
        validate: {
            validator: function (v) {
                return /^[0-9]{10}/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        }
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Please enter a password'],
        minLength: [3, 'Minimum password length is 3 characters']
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
        default: 'null'
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
    }]
}, { timestamps: true })

const userSchema = mongoose.model('User', UserSchema)
export default userSchema;
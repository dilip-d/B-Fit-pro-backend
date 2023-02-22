import mongoose from 'mongoose'

const TrainerSchema = mongoose.Schema({
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
    email: {
        type: String,
        trim: true,
        required: [true, 'Please enter an email'],
        unique: true,
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
        default: 'null',
        required: true
    },
    certificateImage: {
        type: String,
        dafault: 'null',
        required: true
    },
    link: {
        type: String,
        default: 'null',
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
    },
    tips: {
        type: [String]
    },
    service: {
        type: [String]
    },
    price: {
        type: Number,
        trim: true
    },
    availableSlots: [{
        type: String,
    }],
    timing: {
        type: [String],
        default: [
            "05:00am-06:00am",
            "06:30am-07:30am",
            "08:00am-09:00am",
            "05:00pm-06:00pm",
            "06:30pm-07:30pm",
            "08:00pm-09:00pm"
        ]
    },
    wallet: {
        type: Number,
        trim: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    }
}, { timestamps: true })

const trainerSchema = mongoose.model('Trainer', TrainerSchema)
export default trainerSchema;
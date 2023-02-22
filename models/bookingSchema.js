import mongoose from 'mongoose'

const bookingSchema = mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    clientInfo: {
        type: String,
        required: true
    },
    trainerInfo: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    serviceStatus: {
        type: String,
        required: true,
        default: 'Inactive'
    },
    timing: {
        type: String,
        required: true
    },
    amount:{
        type:Number,
    },
    paymentStatus:{
        type: String,
        default:'pending'
    }
}, { timestamps: true })

const bookingModel = mongoose.model('Booking', bookingSchema);
export default bookingModel;
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/adminSchema.js'
import User from '../models/userSchema.js'
import Trainer from '../models/trainerSchema.js'
import dotenv from 'dotenv';
import bookingModel from '../models/bookingSchema.js'

dotenv.config();

export const adminSignup = async (req, res) => {
    const { email, password } = req.body
    try {
        const oldAdmin = await Admin.findOne({ email });

        if (oldAdmin) {
            return res.status(400).json({ message: "Admin already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await Admin.create({
            email,
            password: hashedPassword,
        })
        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(error);
    }
};

export const adminSignin = async (req, res) => {
    console.log('in admin signin');
    try {
        const { email, password } = req.body;
        const oldAdmin = await Admin.findOne({ email });

        if (!oldAdmin)
            return res.status(404).json({ message: "Admin doesn't exist" })

        const isPasswordCorrect = await bcrypt.compare(password, oldAdmin.password)

        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid Credentials" })

        const toke = jwt.sign({ email: oldAdmin.email, id: oldAdmin._id }, process.env.ADMINJWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token: toke, status: 'Login success', admin: oldAdmin })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(error);
    }
}

export const userInfo = async (req, res) => {
    try {
        const users = await User.find();
        res.json({ clientDetails: users, status: 'ok' })
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const blockUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findByIdAndUpdate({ _id: userId }, { isBlocked: true })
        res.json({ status: 'ok', block: true, clientDetails: user })
    } catch (err) {
        res.json({ error: 'Internal Server Error !' });
        console.log(err);
    }
}

export const unblockUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findByIdAndUpdate({ _id: userId }, { isBlocked: false })
        res.json({ status: 'ok', unBlock: true, clientDetails: user })
    } catch (err) {
        res.json({ error: 'Internal Server Error !' });
        console.log(err);
    }
}

export const activeTrainerInfo = async (req, res) => {
    try {
        const trainers = await Trainer.find({ isVerified: true });
        res.json({ activetrainerDetails: trainers, status: 'ok' })
    } catch (err) {
        res.json({ error: 'Internal Server Error !' });
        console.log(err);
    }
}

export const blockTrainer = async (req, res) => {
    try {
        const trainerId = req.params.id
        const trainer = await Trainer.findByIdAndUpdate({ _id: trainerId }, { isBlocked: true })
        res.json({ status: 'ok', block: true, trainerDetails: trainer })
    } catch (err) {
        res.json({ error: 'Internal Server Error !' });
        console.log(err);
    }
}

export const unBlockTrainer = async (req, res) => {
    try {
        const trainerId = req.params.id
        const trainer = await Trainer.findByIdAndUpdate({ _id: trainerId }, { isBlocked: false })
        res.json({ status: 'ok', unBlock: true, trainerDetails: trainer })
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const approvalPendingTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find({ isVerified: false });
        res.json({ trainerDetails: trainers, status: 'ok' })
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const rejectTrainer = async (req, res) => {
    try {
        const trainerId = req.params.id
        const trainer = await Trainer.findByIdAndUpdate({ _id: trainerId }, { isVerified: true })
        res.json({ status: 'ok', rejected: true, trainerDetails: trainer })
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const approveTrainer = async (req, res) => {
    try {
        const trainerId = req.params.id;
        const trainer = await Trainer.findByIdAndUpdate({ _id: trainerId }, { isVerified: true })
        res.json({ status: 'ok', approved: true, trainerDetails: trainer })
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const bookingInfo = async (req, res) => {
    try {
        const bookings = await bookingModel.find();
        res.json({ booking: bookings, status: 'ok' })
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const getAllDetails = async (req, res) => {
    try {
        const numUsers = await User.countDocuments();
        const numTrainers = await Trainer.countDocuments();
        const numBookings = await bookingModel.countDocuments();
        const bookingDetails = await bookingModel.find();

        const result = await bookingModel.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: 0,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);
        const bookingTotal = result[0].totalAmount;

        var totalAmounts
        var createdAtDates

        bookingModel.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $project: {
                    _id: 0,
                    totalAmount: 1,
                    createdAt: { $dateFromString: { dateString: "$_id" } }
                }
            }
        ]).exec((err, result) => {
            if (err) throw err;
            totalAmounts = result.map(item => item.totalAmount);
            createdAtDates = result.map(item => item.createdAt);
            res.json({ numUsers, numTrainers, numBookings, bookingTotal, totalAmounts, createdAtDates, bookingDetails });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
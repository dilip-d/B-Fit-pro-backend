import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'
import Trainer from '../models/trainerSchema.js'
import bookingModel from '../models/bookingSchema.js';

dotenv.config();

// Config
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure: true
})

export const trainerSignup = async (req, res) => {
    try {
        const values = req.body.values
        const ytUrl = values.link;
        values.link = ytUrl.replace('/watch?v=', '/embed/');

        const profileImage = req.body.file1
        const certificateImage = req.body.file2

        const oldTrainer = await Trainer.findOne({ email: values.email });
        const extphone = await Trainer.findOne({ phone: values.phone });

        if (oldTrainer !== null && extphone !== null) {
            return res.json({ status: 'error', error: "Duplicate phone number" })
        } else {
            const hashedPassword = await bcrypt.hash(values.password, 12);

            const file1 = await cloudinary.uploader.upload(profileImage, {
                folder: "trainers"
            })

            const file2 = await cloudinary.uploader.upload(certificateImage, {
                folder: 'certificates'
            })

            const result = await Trainer.create({
                fname: values.fname,
                lname: values.lname,
                dob: values.dob,
                gender: values.gender,
                email: values.email,
                phone: values.phone,
                password: hashedPassword,
                profileImage: file1.url,
                certificateImage: file2.url,
                link: values.link
            })
            const token = jwt.sign({ email: result.email, id: result._id }, process.env.TRAINERJWT_SECRET, { expiresIn: "1d" });
            res.json({ status: 'success' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(error);
    }
};

export const trainerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const oldTrainer = await Trainer.findOne({ email });

        if (!oldTrainer)
            return res.status(404).json({ message: "Trainer doesn't exist" })

        if (!oldTrainer.isVerified === true) {
            return res.status(400).json({ message: "Pending verification" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, oldTrainer.password)

        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid Credentials" })

        const toke = jwt.sign({ name: oldTrainer.fname, email: oldTrainer.email, id: oldTrainer._id }, process.env.TRAINERJWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token: toke, status: 'Login success', trainer: oldTrainer })

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(error);
    }
}

export const getProfile = async (req, res) => {
    try {
        const trainerId = req.params.id
        const trainer = await Trainer.find({ _id: trainerId })
        res.json(trainer)
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const addService = async (req, res) => {
    try {
        const trainerId = req.params.id
        const newService = req.body.service
        const data = await Trainer.findOne({ _id: trainerId, service: { $in: [newService] } });
        if (data) {
            res.json({ error: 'Already Added' })
        } else {
            await Trainer.updateOne({ _id: trainerId }, { $push: { service: newService } });
            res.json({ status: 'ok', message: 'Added Successfully' })
        }
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const addTips = async (req, res) => {
    try {
        const trainerId = req.params.id
        const newTip = req.body.tips
        const data = await Trainer.findOne({ _id: trainerId, tips: { $in: [newTip] } });
        if (data) {
            res.json({ error: 'Already Added' })
        } else {
            await Trainer.updateOne({ _id: trainerId }, { $push: { tips: newTip } });
            res.json({ status: 'ok', message: 'Added Successfully' })
        }
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const addDescription = async (req, res) => {
    try {
        const trainerId = req.params.id
        const newDescription = req.body.description
        const data = await Trainer.findOne({ _id: trainerId, description: { $eq: newDescription } });
        if (data) {
            res.json({ error: 'Already Added' })
        } else {
            await Trainer.updateOne({ _id: trainerId }, { $set: { description: newDescription } });
            res.json({ status: 'ok', message: 'Added Successfully' })
        }
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const addPrice = async (req, res) => {
    try {
        const trainerId = req.params.id
        const newPrice = req.body.price
        const data = await Trainer.findOne({ _id: trainerId, price: { $eq: newPrice } });
        if (data) {
            res.json({ error: 'Already Added' })
        } else {
            await Trainer.updateOne({ _id: trainerId }, { $set: { price: newPrice } });
            res.json({ status: 'ok', message: 'Added Successfully' })
        }
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const editProfile = async (req, res) => {
    try {
        const trainerId = req.params.id
        const file = req.body.image

        const data = await Trainer.findOne({ _id: trainerId });

        if (file) {
            const imageUrl = data.profileImage
            const publicId = imageUrl.match(/\/([^\/]*)$/)[1].split('.')[0];
            cloudinary.uploader.destroy(publicId, function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(result);
                }
            });
        }

        const file1 = await cloudinary.uploader.upload(file, {
            folder: "trainers"
        })

        await Trainer.updateOne({ _id: trainerId }, {
            $set: {
                fname: req.body.firstName,
                lname: req.body.lastName,
                gender: req.body.gender,
                dob: req.body.dob,
                profileImage: file1.url
            }
        });

        res.json({ status: 'ok', message: 'Added Successfully' })

    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const getTrainerBookings = async (req, res) => {
    try {
        const Id = req.params.id
        const trainer = await bookingModel.find({ trainerId: Id })
        res.json(trainer)
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const deleteService = async (req, res) => {
    try {
        const Id = req.params.id;
        await Trainer.updateOne({ _id: Id }, { $pull: { service: req.body.item } });
        res.json({status: true});
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}

export const deleteTips = async (req, res) => {
    try {
        const Id = req.params.id;
        await Trainer.updateOne({ _id: Id }, { $pull: { tips: req.body.item } });
        res.json({status: true});
    } catch (err) {
        console.log(err);
        res.json({ error: 'Internal Server Error !' });
    }
}
import Conversation from '../models/conversationSchema.js'
import Trainer from '../models/trainerSchema.js'
import User from '../models/userSchema.js'

export const postConversation = async (req, res) => {
    const userId = req.body.userid;
    const trainerId = req.body.trainerId;
    try {
        const existingConversation = await Conversation.findOne({
            members: { $all: [userId, trainerId] }
        });
        if (existingConversation) {
            res.status(200).json(existingConversation);
        } else {
            const newConversation = new Conversation({
                members: [userId, trainerId]
            });
            const savedConversation = await newConversation.save();

            res.status(200).json(savedConversation);
        }
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userid] }
        });
        res.status(200).json(conversation)
    } catch (error) {
        res.status(500).json({ error })
    }
}

export const getDetails = async (req, res) => {
    try {
        const trainerDetails = await Trainer.findOne({ _id: req.params.trainerId }).select('fname email profileImage')
        res.status(200).json(trainerDetails)
    } catch (error) {
        res.status(500).json({ error })
    }
}

export const getUserDetails = async (req, res) => {
    try {
        const userDetails = await User.findOne({ _id: req.params.userId }).select('fname email')
        res.status(200).json(userDetails)
    } catch (error) {
        res.status(500).json({ error })
    }
}

export const videoConversation = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $all: [req.params.userId, req.params.id] }
        });
        res.status(200).json(conversation)
    } catch (error) {
        res.status(500).json({ error })
    }
}
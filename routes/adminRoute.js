import express from 'express';
const router = express.Router();

import {
    activeTrainerInfo,
    adminSignin,
    adminSignup,
    approvalPendingTrainers,
    approveTrainer,
    blockTrainer,
    blockUser,
    bookingInfo,
    getAllDetails,
    rejectTrainer,
    unBlockTrainer,
    unblockUser,
    userInfo
} from '../controllers/adminController.js';
import { adminProtect } from '../middleware/authMiddleware.js';

//admin login & signup
router.post('/adminSignup', adminSignup);
router.post('/api/adminLogin', adminSignin);

//user management
router.get('/api/userInfo', adminProtect, userInfo);
router.get('/api/blockUserinfo/:id', adminProtect, blockUser);
router.get('/api/unBlockuserinfo/:id', adminProtect, unblockUser);

//trainer management
router.get('/api/activeTrainerInfo', adminProtect, activeTrainerInfo);
router.get('/api/blockTrainer/:id', adminProtect, blockTrainer);
router.get('/api/unBlockTrainer/:id', adminProtect, unBlockTrainer);
router.get('/api/getTrainerDetails', adminProtect, approvalPendingTrainers);
router.get('/api/trainerReject/:id', adminProtect, rejectTrainer);
router.get('/api/trainerApproval/:id', adminProtect, approveTrainer);

//booking management
router.get('/api/bookingInfo', adminProtect, bookingInfo);
router.get('/api/getAllDetails', adminProtect, getAllDetails);
export default router;
import express from 'express';
const router = express.Router();

import { cancelPlan, checkAvailability, editUserProfile, getAvailability, getBookings, getUserProfile, payment, resendOTP, signin, signup, trainerDetail, trainerList, verifyOTP, verifyPayment } from '../controllers/userController.js';
import { clientProtect } from '../middleware/authMiddleware.js';

//signup and login
router.post('/api/clientRegister', signup);
router.post('/api/verifyOTP/:id', verifyOTP);
router.post('/api/resendOTP', resendOTP);
router.post('/api/clientLogin', signin);

//trainer list and detail
router.get('/api/trainerList', trainerList);
router.get('/api/trainerDetail/:id', trainerDetail);
router.get('/api/trainerCheckAvailable/:id', clientProtect, getAvailability);

//Availabilty & booking
router.post('/api/checkAvailability/:id', clientProtect, checkAvailability);
router.post('/api/payment/:id', clientProtect, payment);
router.post('/api/verifyPayment', clientProtect, verifyPayment);

//profile
router.get('/api/getUserProfile/:id', clientProtect, getUserProfile);
router.post('/api/editProfile/:id', clientProtect, editUserProfile);

//payment & cancellation
router.get('/api/getBookings/:id', clientProtect, getBookings);
router.get('/api/cancelPlan/:id', clientProtect, cancelPlan);

export default router;
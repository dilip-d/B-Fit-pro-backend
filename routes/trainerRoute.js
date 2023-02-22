import express from 'express';
const router = express.Router();

import { addDescription, addPrice, addService, addTips, deleteService, deleteTips, editProfile, getProfile, getTrainerBookings, trainerLogin, trainerSignup } from '../controllers/trainerController.js';
import { trainerProtect } from '../middleware/authMiddleware.js';

//signup and login
router.post('/api/trainerRegister', trainerSignup);
router.post('/api/trainerLogin', trainerLogin);

//profile details add and edit
router.get('/api/getProfile/:id', trainerProtect, getProfile);
router.post('/api/addService/:id', trainerProtect, addService);
router.post('/api/addTips/:id', trainerProtect, addTips);
router.post('/api/addDescription/:id', trainerProtect, addDescription);
router.post('/api/addPrice/:id', trainerProtect, addPrice);

router.post('/api/editProfile/:id', trainerProtect, editProfile);
router.post('/api/deleteService/:id', trainerProtect, deleteService);
router.post('/api/deleteTip/:id', trainerProtect, deleteTips);

router.get('/api/getTrainerBookings/:id', trainerProtect, getTrainerBookings);

export default router;
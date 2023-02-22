import express from 'express';
const router = express.Router();
import { getMessage, postMessage } from '../controllers/messageController.js';

router.post('/api', postMessage);
router.get('/api/:conversationId', getMessage);

export default router;
import express from 'express';
import { sendMessage, getAllMessages, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

// Route to create a new message
router.post('/messages', sendMessage);

// Route to get all messages
router.get('/messages', getAllMessages);

// Route to delete a message by ID
router.delete('/messages/:id', deleteMessage);

export default router;

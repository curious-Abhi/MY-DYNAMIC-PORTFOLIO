import express from 'express';
import { sendMessage, fetchAllMessages, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

// Route to create a new message
router.post('/send', sendMessage);

// Route to get all messages
router.get('/getall', fetchAllMessages);

// Route to delete a message by ID
router.delete('/messages/:id', deleteMessage);

export default router;

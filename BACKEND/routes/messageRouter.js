import express from 'express';
import { sendMessage, fetchAllMessages, deleteMessage } from '../controllers/messageController.js';
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route to create a new message
router.post('/send', sendMessage);

// Route to get all messages
router.get('/getall', fetchAllMessages);

// Route to delete a message by ID
router.delete('/delete/:id',isAuthenticated, deleteMessage);

export default router;

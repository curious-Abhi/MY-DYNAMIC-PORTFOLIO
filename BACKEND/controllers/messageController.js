import db from '../database/dbconnection.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/error.js';

// Function to create a new message
export const createMessage = async ({ senderName, subject, message }) => {
  const query = `
    INSERT INTO messages (senderName, subject, message)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [senderName, subject, message];

  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (error) {
    throw new Error('Failed to create message: ' + error.message);
  }
};

// Function to get all messages
export const getAllMessages = async () => {
  const query = 'SELECT * FROM messages ORDER BY createdat DESC';

  try {
    const res = await db.query(query);
    return res.rows;
  } catch (error) {
    throw new Error('Failed to fetch messages: ' + error.message);
  }
};

// Function to get a message by ID
export const getMessageById = async (id) => {
  const query = 'SELECT * FROM messages WHERE id = $1';
  const values = [id];

  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (error) {
    throw new Error('Failed to fetch message: ' + error.message);
  }
};

// Function to delete a message by ID
export const deleteMessageById = async (id) => {
  const query = 'DELETE FROM messages WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (error) {
    throw new Error('Failed to delete message: ' + error.message);
  }
};

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { senderName, subject, message } = req.body;
  if (!senderName || !subject || !message) {
    return next(new ErrorHandler('Please Fill Full Form!', 400));
  }
  const data = await createMessage({ senderName, subject, message });
  res.status(201).json({
    success: true,
    message: 'Message Sent',
    data,
  });
});

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const message = await getMessageById(id);
  if (!message) {
    return next(new ErrorHandler('Message Already Deleted!', 400));
  }
  await deleteMessageById(id);
  res.status(201).json({
    success: true,
    message: 'Message Deleted',
  });
});

export const fetchAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await getAllMessages();
  res.status(200).json({
    success: true,
    messages,
  });
});

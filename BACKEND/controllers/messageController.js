import { createMessage, getAllMessages, getMessageById, deleteMessageById } from '../models/messageSchema.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/error.js';

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

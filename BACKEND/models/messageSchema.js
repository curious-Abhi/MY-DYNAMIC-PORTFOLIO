import pg from "pg";
import db from "../database/dbconnection.js"

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

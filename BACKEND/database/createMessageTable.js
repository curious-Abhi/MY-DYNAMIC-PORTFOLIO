import db from "./dbconnection.js"

const createMessageTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      senderName VARCHAR(255) NOT NULL CHECK (char_length(senderName) >= 2),
      subject VARCHAR(255) NOT NULL CHECK (char_length(subject) >= 2),
      message TEXT NOT NULL CHECK (char_length(message) >= 2),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await db.query(query);
    console.log("Messages table created successfully");
  } catch (error) {
    console.error("Failed to create messages table", error);
  }
};

createMessageTable().catch(console.error);

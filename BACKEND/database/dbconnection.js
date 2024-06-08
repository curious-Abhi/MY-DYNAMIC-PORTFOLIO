
import pg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "./config/config.env" });

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Connection to PostgreSQL database failed", err));

export default db;

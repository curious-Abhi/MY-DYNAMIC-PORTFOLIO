import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db from "../database/dbconnection.js";

export const createUser = async (userData) => {
  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    avatarPublicId,
    avatarUrl,
    resumePublicId,
    resumeUrl,
    portfolioURL,
    githubURL,
    instagramURL,
    twitterURL,
    linkedInURL,
    facebookURL
  } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (
      full_name, email, phone, about_me, password, avatar_public_id, avatar_url,
      resume_public_id, resume_url, portfolio_url, github_url, instagram_url,
      twitter_url, linkedin_url, facebook_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *
  `;

  const values = [
    fullName,
    email,
    phone,
    aboutMe,
    hashedPassword,
    avatarPublicId,
    avatarUrl,
    resumePublicId,
    resumeUrl,
    portfolioURL,
    githubURL,
    instagramURL,
    twitterURL,
    linkedInURL,
    facebookURL
  ];

  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (error) {
    throw new Error("Failed to create user: " + error.message);
  }
};

export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];

  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (error) {
    throw new Error("Failed to find user by email: " + error.message);
  }
};

export const comparePassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

export const generateJsonWebToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const getResetPasswordToken = async (userId) => {
  const resetToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const query = `
    UPDATE users
    SET reset_password_token = $1, reset_password_expire = $2
    WHERE id = $3
    RETURNING *
  `;
  
  const values = [hashedToken, Date.now() + 15 * 60 * 1000, userId];

  try {
    await db.query(query, values);
    return resetToken;
  } catch (error) {
    throw new Error("Failed to set reset password token: " + error.message);
  }
};

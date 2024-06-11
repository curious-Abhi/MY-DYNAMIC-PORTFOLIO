import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../database/dbconnection.js';

// Create User
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

// Find User by Email
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

// Compare Password
export const comparePassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

// Generate JWT
export const generateJsonWebToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Get Reset Password Token
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
  
  const values = [hashedToken, new Date(Date.now() + 15 * 60 * 1000), userId];

  try {
    const res = await db.query(query, values);
    return resetToken;
  } catch (error) {
    throw new Error("Failed to set reset password token: " + error.message);
  }
};

// Find User by ID
export const findUserById = async (id) => {
 // const query = "SELECT * FROM users WHERE id = $1";
 const query = "SELECT id, full_name, email, phone, about_me, avatar_public_id, avatar_url, resume_public_id, resume_url, portfolio_url, github_url, instagram_url, twitter_url, linkedin_url, facebook_url FROM users WHERE id = $1";
  const values = [id];

  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (error) {
    throw new Error("Failed to find user by ID: " + error.message);
  }
};

// Update User
export const updateUserById = async (id, updatedData) => {
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
  } = updatedData;

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const query = `
    UPDATE users
    SET full_name = $1, email = $2, phone = $3, about_me = $4, 
        password = COALESCE($5, password), 
        avatar_public_id = $6, avatar_url = $7, resume_public_id = $8, resume_url = $9, 
        portfolio_url = $10, github_url = $11, instagram_url = $12, 
        twitter_url = $13, linkedin_url = $14, facebook_url = $15
    WHERE id = $16
    RETURNING *;
  `;

  const values = [
    fullName, email, phone, aboutMe,
    hashedPassword, avatarPublicId, avatarUrl,
    resumePublicId, resumeUrl, portfolioURL,
    githubURL, instagramURL, twitterURL,
    linkedInURL, facebookURL, id
  ];

  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (error) {
    throw new Error("Failed to update user: " + error.message);
  }
};

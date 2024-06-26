import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import db from "../database/dbconnection.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../utils/jwtToken.js"; 
import ErrorHandler from "../middlewares/error.js";
import { sendEmail } from "../utils/sendEmail.js";

// Register a new user
export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar and resume required!", 400));
  }

  const { avatar, resume } = req.files;

  // Upload avatar to Cloudinary
  const avatarUpload = await cloudinary.uploader.upload(avatar.tempFilePath, { folder: "PORTFOLIO_AVATAR" });
  if (!avatarUpload) {
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }

  // Upload resume to Cloudinary
  const resumeUpload = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "PORTFOLIO_RESUME" });
  if (!resumeUpload) {
    return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
  }

  const { fullName, email, phone, aboutMe, password, portfolioURL, githubURL, instagramURL, twitterURL, facebookURL, linkedInURL } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (
      full_name, email, phone, about_me, password, avatar_public_id, avatar_url,
      resume_public_id, resume_url, portfolio_url, github_url, instagram_url,
      twitter_url, linkedin_url, facebook_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *;
  `;

  const values = [
    fullName, email, phone, aboutMe, hashedPassword, avatarUpload.public_id, avatarUpload.secure_url,
    resumeUpload.public_id, resumeUpload.secure_url, portfolioURL, githubURL, instagramURL,
    twitterURL, linkedInURL, facebookURL
  ];

  try {
    const result = await db.query(query, values);
    const user = result.rows[0];
    generateToken(user, "Registered!", 201, res); // Use the generateToken function
  } catch (error) {
    return next(new ErrorHandler("Failed to create user: " + error.message, 500));
  }
});




// Login user
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Provide Email and Password!", 400));
  }

  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];

  try {
    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password!", 404));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email or Password!", 401));
    }

    generateToken(user, "Login Successfully!", 200, res);
  } catch (error) {
    return next(new ErrorHandler("Failed to login: " + error.message, 500));
  }
});


// Logout user
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  }).json({
    success: true,
    message: "Logged Out!",
  });
});



// Get user profile
export const getUser = catchAsyncErrors(async (req, res, next) => {
  //const query = "SELECT * FROM users WHERE id = $1";
  const query = `
    SELECT id, full_name, email, phone, about_me, avatar_public_id, avatar_url, 
           resume_public_id, resume_url, portfolio_url, github_url, instagram_url, 
           twitter_url, linkedin_url, facebook_url 
    FROM users 
    WHERE id = $1
  `;
  const values = [req.user.id];

  try {
    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to get user: " + error.message, 500));
  }
});



// Update user profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
    about_me: req.body.about_me,
    github_url: req.body.github_url,
    instagram_url: req.body.instagram_url,
    portfolio_url: req.body.portfolio_url,
    facebook_url: req.body.facebook_url,
    twitter_url: req.body.twitter_url,
    linkedin_url: req.body.linkedin_url,
  };

  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const userQuery = "SELECT avatar_public_id FROM users WHERE id = $1";
    const userResult = await db.query(userQuery, [req.user.id]);
    const profileImageId = userResult.rows[0].avatar_public_id;

    await cloudinary.uploader.destroy(profileImageId);
    const newProfileImage = await cloudinary.uploader.upload(avatar.tempFilePath, { folder: "PORTFOLIO_AVATAR" });
    newUserData.avatar_public_id = newProfileImage.public_id;
    newUserData.avatar_url = newProfileImage.secure_url;
  }

  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const userQuery = "SELECT resume_public_id FROM users WHERE id = $1";
    const userResult = await db.query(userQuery, [req.user.id]);
    const resumeFileId = userResult.rows[0].resume_public_id;

    if (resumeFileId) {
      await cloudinary.uploader.destroy(resumeFileId);
    }

    const newResume = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "PORTFOLIO_RESUME" });
    newUserData.resume_public_id = newResume.public_id;
    newUserData.resume_url = newResume.secure_url;
  }

  const updateQuery = `
    UPDATE users
    SET full_name = $1, email = $2, phone = $3, about_me = $4, 
        github_url = $5, instagram_url = $6, portfolio_url = $7, 
        facebook_url = $8, twitter_url = $9, linkedin_url = $10,
        avatar_public_id = COALESCE($11, avatar_public_id),
        avatar_url = COALESCE($12, avatar_url),
        resume_public_id = COALESCE($13, resume_public_id),
        resume_url = COALESCE($14, resume_url)
    WHERE id = $15
    RETURNING *;
  `;

  const updateValues = [
    newUserData.full_name, newUserData.email, newUserData.phone, newUserData.about_me,
    newUserData.github_url, newUserData.instagram_url, newUserData.portfolio_url,
    newUserData.facebook_url, newUserData.twitter_url, newUserData.linkedin_url,
    newUserData.avatar_public_id, newUserData.avatar_url,
    newUserData.resume_public_id, newUserData.resume_url, req.user.id
  ];

  try {
    const result = await db.query(updateQuery, updateValues);
    const updatedUser = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Profile Updated!",
      user: updatedUser,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to update profile: " + error.message, 500));
  }
});


// Update user password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  const query = "SELECT * FROM users WHERE id = $1";
  const values = [req.user.id];

  try {
    const result = await db.query(query, values);
    const user = result.rows[0];

    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Incorrect current password!", 401));
    }

    if (newPassword !== confirmNewPassword) {
      return next(new ErrorHandler("New password and confirm password do not match!", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatePasswordQuery = "UPDATE users SET password = $1 WHERE id = $2";
    await db.query(updatePasswordQuery, [hashedPassword, req.user.id]);

    res.status(200).json({
      success: true,
      message: "Password Updated!",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to update password: " + error.message, 500));
  }
});



// Get user for portfolio
export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
  const id = "1";
  const query = `
    SELECT id, full_name, email, phone, about_me, avatar_public_id, avatar_url, 
           resume_public_id, resume_url, portfolio_url, github_url, instagram_url, 
           twitter_url, linkedin_url, facebook_url 
    FROM users 
    WHERE id = $1
  `;
  const values = [id];

  try {
    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to get user: " + error.message, 500));
  }
});



// Forgot password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [req.body.email];

  try {
    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // console.log("Generated Reset Token:", resetToken);
    // console.log("Hashed Reset Token:", resetPasswordToken);
    // console.log("Reset Password Expire:", resetPasswordExpire);

    const updateQuery = "UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE email = $3";
    await db.query(updateQuery, [resetPasswordToken, resetPasswordExpire, user.email]);

    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
    const message = `Your reset password token is: \n\n${resetPasswordUrl}\n\nIf you did not request this, please ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Portfolio Dashboard Password Recovery",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      await db.query(updateQuery, [null, null, user.email]);
      return next(new ErrorHandler("Failed to send email: " + error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler("Failed to initiate password reset: " + error.message, 500));
  }
});

// Reset Password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetToken = req.params.token;
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Get current time as ISO string
  const currentTime = new Date().toISOString();

  // console.log("Received Reset Token:", resetToken);
  // console.log("Hashed Reset Token:", resetPasswordToken);
  // console.log("Current Time:", currentTime);

  const query = "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > $2";
  const values = [resetPasswordToken, currentTime];

  try {
    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return next(new ErrorHandler("Reset password token is invalid or has expired.", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password and confirm password do not match.", 400));
    }

    // Ensure password is provided
    if (!req.body.password) {
      return next(new ErrorHandler("Password is required.", 400));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updateQuery = `
      UPDATE users
      SET password = $1, reset_password_token = $2, reset_password_expire = $3
      WHERE id = $4
    `;
    const updateValues = [hashedPassword, null, null, user.id];
    await db.query(updateQuery, updateValues);

    generateToken(user, "Reset Password Successfully!", 200, res);
  } catch (error) {
    return next(new ErrorHandler("Failed to reset password: " + error.message, 500));
  }
});




import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import bcrypt from "bcrypt";

// Register User
export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar Required!", 400));
  }
  const { avatar, resume } = req.files;

  //POSTING AVATAR
  const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "PORTFOLIO AVATAR" }
  );
  if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseForAvatar.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }

  //POSTING RESUME
  const cloudinaryResponseForResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: "PORTFOLIO RESUME" }
  );
  if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseForResume.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
  }

  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    twitterURL,
    facebookURL,
    linkedInURL,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const userQuery = `
    INSERT INTO users 
      (full_name, email, phone, about_me, password, portfolio_url, github_url, instagram_url, twitter_url, facebook_url, linkedin_url, avatar_public_id, avatar_url, resume_public_id, resume_url) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *;
  `;

  const values = [
    fullName, email, phone, aboutMe, hashedPassword, portfolioURL, githubURL, instagramURL, twitterURL, facebookURL, linkedInURL, 
    cloudinaryResponseForAvatar.public_id, cloudinaryResponseForAvatar.secure_url, 
    cloudinaryResponseForResume.public_id, cloudinaryResponseForResume.secure_url
  ];

  const { rows } = await pool.query(userQuery, values);
  const user = rows[0];

  generateToken(user, "Registered!", 201, res);
});

// Login User
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Provide Email And Password!", 400));
  }

  const userQuery = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(userQuery, [email]);
  const user = rows[0];

  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 404));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password", 401));
  }

  generateToken(user, "Login Successfully!", 200, res);
});

// Logout User
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out!",
    });
});

// Get User Details
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const userQuery = `SELECT * FROM users WHERE id = $1`;
  const { rows } = await pool.query(userQuery, [req.user.id]);
  const user = rows[0];

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    githubURL: req.body.githubURL,
    instagramURL: req.body.instagramURL,
    portfolioURL: req.body.portfolioURL,
    facebookURL: req.body.facebookURL,
    twitterURL: req.body.twitterURL,
    linkedInURL: req.body.linkedInURL,
  };

  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const userQuery = `SELECT avatar_public_id FROM users WHERE id = $1`;
    const { rows } = await pool.query(userQuery, [req.user.id]);
    const user = rows[0];

    await cloudinary.uploader.destroy(user.avatar_public_id);

    const newProfileImage = await cloudinary.uploader.upload(avatar.tempFilePath, {
      folder: "PORTFOLIO AVATAR",
    });

    newUserData.avatar_public_id = newProfileImage.public_id;
    newUserData.avatar_url = newProfileImage.secure_url;
  }

  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const userQuery = `SELECT resume_public_id FROM users WHERE id = $1`;
    const { rows } = await pool.query(userQuery, [req.user.id]);
    const user = rows[0];

    await cloudinary.uploader.destroy(user.resume_public_id);

    const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
      folder: "PORTFOLIO RESUME",
    });

    newUserData.resume_public_id = newResume.public_id;
    newUserData.resume_url = newResume.secure_url;
  }

  const updateQuery = `
    UPDATE users 
    SET full_name = $1, email = $2, phone = $3, about_me = $4, github_url = $5, instagram_url = $6, portfolio_url = $7, facebook_url = $8, twitter_url = $9, linkedin_url = $10, avatar_public_id = $11, avatar_url = $12, resume_public_id = $13, resume_url = $14
    WHERE id = $15
    RETURNING *;
  `;

  const values = [
    newUserData.fullName, newUserData.email, newUserData.phone, newUserData.aboutMe, newUserData.githubURL, newUserData.instagramURL, 
    newUserData.portfolioURL, newUserData.facebookURL, newUserData.twitterURL, newUserData.linkedInURL, 
    newUserData.avatar_public_id, newUserData.avatar_url, newUserData.resume_public_id, newUserData.resume_url, 
    req.user.id
  ];

  const { rows: updatedRows } = await pool.query(updateQuery, values);
  const updatedUser = updatedRows[0];

  res.status(200).json({
    success: true,
    message: "Profile Updated!",
    user: updatedUser,
  });
});

// Update Password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const userQuery = `SELECT * FROM users WHERE id = $1`;
  const { rows } = await pool.query(userQuery, [req.user.id]);
  const user = rows[0];

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please Fill All Fields.", 400));
  }

  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Current Password!"));
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New Password And Confirm New Password Do Not Match!"));
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  const updatePasswordQuery = `UPDATE users SET password = $1 WHERE id = $2`;
  await pool.query(updatePasswordQuery, [hashedNewPassword, req.user.id]);

  res.status(200).json({
    success: true,
    message: "Password Updated!",
  });
});

// Get User for Portfolio
export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
  const userId = req.query.userId || "663296a896e553748ab5b0be"; // Default ID if not provided
  const userQuery = `SELECT * FROM users WHERE id = $1`;
  const { rows } = await pool.query(userQuery, [userId]);
  const user = rows[0];

  res.status(200).json({
    success: true,
    user,
  });
});

// Forgot Password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const userQuery = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(userQuery, [req.body.email]);
  const user = rows[0];

  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  const updateTokenQuery = `
    UPDATE users 
    SET reset_password_token = $1, reset_password_expire = $2 
    WHERE id = $3
  `;
  await pool.query(updateTokenQuery, [resetPasswordToken, resetPasswordExpire, user.id]);

  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If 
  You've not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Personal Portfolio Dashboard Password Recovery`,
      message,
    });
    res.status(201).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    const resetTokenClearQuery = `
      UPDATE users 
      SET reset_password_token = NULL, reset_password_expire = NULL 
      WHERE id = $1
    `;
    await pool.query(resetTokenClearQuery, [user.id]);
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const userQuery = `
    SELECT * FROM users 
    WHERE reset_password_token = $1 AND reset_password_expire > $2
  `;
  const { rows } = await pool.query(userQuery, [resetPasswordToken, Date.now()]);
  const user = rows[0];

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has been expired.", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password & Confirm Password do not match"));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const updatePasswordQuery = `
    UPDATE users 
    SET password = $1, reset_password_token = NULL, reset_password_expire = NULL 
    WHERE id = $2
  `;
  await pool.query(updatePasswordQuery, [hashedPassword, user.id]);

  generateToken(user, "Reset Password Successfully!", 200, res);
});

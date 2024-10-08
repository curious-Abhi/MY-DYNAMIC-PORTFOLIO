import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import db from "../database/dbconnection.js";
import { v2 as cloudinary } from "cloudinary";

// Add a new software application
export const addNewApplication = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Software Application Icon/Image Required!", 404));
  }
  
  const { svg } = req.files;
  const { name } = req.body;

  if (!name) {
    return next(new ErrorHandler("Please Provide Software's Name!", 400));
  }

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      svg.tempFilePath,
      { folder: "PORTFOLIO_SOFTWARE_APPLICATION_IMAGES" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
      return next(new ErrorHandler("Failed to upload svg to Cloudinary", 500));
    }

    const query = `
      INSERT INTO software_applications (name, svg_public_id, svg_url)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [name, cloudinaryResponse.public_id, cloudinaryResponse.secure_url];

    const result = await db.query(query, values);
    const softwareApplication = result.rows[0];

    res.status(201).json({
      success: true,
      message: "New Software Application Added!",
      softwareApplication,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to add software application: " + error.message, 500));
  }
});

// Delete a software application
export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    const findQuery = 'SELECT * FROM software_applications WHERE id = $1';
    const deleteQuery = 'DELETE FROM software_applications WHERE id = $1 RETURNING *';
    const values = [id];

    const result = await db.query(findQuery, values);
    const softwareApplication = result.rows[0];

    if (!softwareApplication) {
      return next(new ErrorHandler("Already Deleted!", 404));
    }

    const softwareApplicationSvgId = softwareApplication.svg_public_id;
    await cloudinary.uploader.destroy(softwareApplicationSvgId);
    await db.query(deleteQuery, values);

    res.status(200).json({
      success: true,
      message: "Software Application Deleted!",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to delete software application: " + error.message, 500));
  }
});

// Get all software applications
export const getAllApplications = catchAsyncErrors(async (req, res, next) => {
  const query = 'SELECT * FROM software_applications';

  try {
    const result = await db.query(query);
    const softwareApplications = result.rows;
    res.status(200).json({
      success: true,
      softwareApplications,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to retrieve software applications: " + error.message, 500));
  }
});

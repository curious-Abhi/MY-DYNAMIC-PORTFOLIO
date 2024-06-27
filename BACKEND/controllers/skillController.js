import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import db from "../database/dbconnection.js";
import { v2 as cloudinary } from "cloudinary";

// Add a new skill
export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Image For Skill Required!", 404));
  }

  const { svg } = req.files;
  const { title, proficiency } = req.body;

  if (!title || !proficiency) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      svg.tempFilePath,
      { folder: "PORTFOLIO_SKILL_IMAGES" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
      return next(new ErrorHandler("Failed to upload svg to Cloudinary", 500));
    }

    const query = `
      INSERT INTO skills (title, proficiency, svg_public_id, svg_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [title, proficiency, cloudinaryResponse.public_id, cloudinaryResponse.secure_url];

    const result = await db.query(query, values);
    const skill = result.rows[0];

    res.status(201).json({
      success: true,
      message: "New Skill Added",
      skill,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to add skill: " + error.message, 500));
  }
});

// Delete a skill
export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  console.log('Received ID:', id);  // Debug log

  const skillId = parseInt(id, 10);
  console.log('Converted Skill ID:', skillId);
  console.log('Type of Converted Skill ID:', typeof skillId);

  if (isNaN(skillId)) {
    return next(new ErrorHandler('Invalid Skill ID', 400));
  }

  try {
    const findQuery = 'SELECT * FROM skills WHERE id = $1';
    const findValues = [skillId];
    const result = await db.query(findQuery, findValues);
    const skill = result.rows[0];

    if (!skill) {
      return next(new ErrorHandler('Skill not found', 404));
    }

    const skillSvgId = skill.svg_public_id;
    await cloudinary.uploader.destroy(skillSvgId);

    const deleteQuery = 'DELETE FROM skills WHERE id = $1 RETURNING *';
    await db.query(deleteQuery, findValues);

    res.status(200).json({
      success: true,
      message: 'Skill Deleted!',
    });
  } catch (error) {
    return next(new ErrorHandler(`Failed to delete skill: ${error.message}`, 500));
  }
});




// Update a skill
export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { proficiency } = req.body;

  // Ensure id is a string and proficiency is defined
  console.log('Converted Skill ID:', id);
  console.log('Type of Converted Skill ID:', typeof id);
  console.log('Converted proficiency:', proficiency);
  console.log('Type of proficiency:', typeof proficiency);

  // Convert skillId to integer if necessary
  const skillId = parseInt(id, 10);

  // Check if proficiency is undefined or not a valid number
  if (isNaN(skillId)) {
    return next(new ErrorHandler("Invalid skill ID", 400));
  }
  if (proficiency === undefined || isNaN(proficiency)) {
    return next(new ErrorHandler("Invalid proficiency value", 400));
  }

  try {
    const findQuery = 'SELECT * FROM skills WHERE id = $1';
    const values = [skillId];

    const result = await db.query(findQuery, values);
    let skill = result.rows[0];

    if (!skill) {
      return next(new ErrorHandler("Skill not found!", 404));
    }

    const updateQuery = `
      UPDATE skills
      SET proficiency = $1
      WHERE id = $2
      RETURNING *;
    `;
    const updateValues = [proficiency, skillId];

    const updateResult = await db.query(updateQuery, updateValues);
    skill = updateResult.rows[0];

    res.status(200).json({
      success: true,
      message: "Skill Updated!",
      skill,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to update skill: " + error.message, 500));
  }
});



// Get all skills
export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
  const query = 'SELECT * FROM skills';

  try {
    const result = await db.query(query);
    const skills = result.rows;
    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to retrieve skills: " + error.message, 500));
  }
});

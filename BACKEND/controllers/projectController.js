import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import db from "../database/dbconnection.js";
import { v2 as cloudinary } from "cloudinary";

// Add a new project
export const addNewProject = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Project Banner Image Required!", 404));
  }

  const { projectBanner } = req.files;
  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
  } = req.body;

  if (
    !title ||
    !description ||
    !gitRepoLink ||
    !projectLink ||
    !stack ||
    !technologies ||
    !deployed
  ) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      { folder: "PORTFOLIO_PROJECT_IMAGES" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
      return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
    }

    const query = `
      INSERT INTO projects (title, description, git_repo_link, project_link, stack, technologies, deployed, project_banner_public_id, project_banner_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [
      title,
      description,
      gitRepoLink,
      projectLink,
      stack,
      technologies,
      deployed,
      cloudinaryResponse.public_id,
      cloudinaryResponse.secure_url,
    ];

    const result = await db.query(query, values);
    const project = result.rows[0];

    res.status(201).json({
      success: true,
      message: "New Project Added!",
      project,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to add project: " + error.message, 500));
  }
});

// Update a project
export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
  } = req.body;

  const { id } = req.params;
  let newProjectData = {
    title,
    description,
    git_repo_link: gitRepoLink,
    project_link: projectLink,
    stack,
    technologies,
    deployed,
  };

  try {
    if (req.files && req.files.projectBanner) {
      const projectBanner = req.files.projectBanner;
      const findQuery = 'SELECT * FROM projects WHERE id = $1';
      const findResult = await db.query(findQuery, [id]);
      const project = findResult.rows[0];
      const projectImageId = project.project_banner_public_id;
      await cloudinary.uploader.destroy(projectImageId);

      const cloudinaryResponse = await cloudinary.uploader.upload(
        projectBanner.tempFilePath,
        { folder: "PORTFOLIO_PROJECT_IMAGES" }
      );

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
        return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
      }

      newProjectData.project_banner_public_id = cloudinaryResponse.public_id;
      newProjectData.project_banner_url = cloudinaryResponse.secure_url;
    }

    const query = `
      UPDATE projects
      SET title = $1, description = $2, git_repo_link = $3, project_link = $4, stack = $5, technologies = $6, deployed = $7, project_banner_public_id = $8, project_banner_url = $9
      WHERE id = $10
      RETURNING *;
    `;
    const values = [
      newProjectData.title,
      newProjectData.description,
      newProjectData.git_repo_link,
      newProjectData.project_link,
      newProjectData.stack,
      newProjectData.technologies,
      newProjectData.deployed,
      newProjectData.project_banner_public_id,
      newProjectData.project_banner_url,
      id,
    ];

    const result = await db.query(query, values);
    const project = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Project Updated!",
      project,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to update project: " + error.message, 500));
  }
});

// Delete a project
export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    const findQuery = 'SELECT * FROM projects WHERE id = $1';
    const findResult = await db.query(findQuery, [id]);
    const project = findResult.rows[0];

    if (!project) {
      return next(new ErrorHandler("Already Deleted!", 404));
    }

    const projectImageId = project.project_banner_public_id;
    await cloudinary.uploader.destroy(projectImageId);

    const deleteQuery = 'DELETE FROM projects WHERE id = $1 RETURNING *';
    await db.query(deleteQuery, [id]);

    res.status(200).json({
      success: true,
      message: "Project Deleted!",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to delete project: " + error.message, 500));
  }
});

// Get all projects
export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
  const query = 'SELECT * FROM projects';

  try {
    const result = await db.query(query);
    const projects = result.rows;
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to retrieve projects: " + error.message, 500));
  }
});

// Get a single project
export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await db.query(query, [id]);
    const project = result.rows[0];

    if (!project) {
      return next(new ErrorHandler("Project not found!", 404));
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to retrieve project: " + error.message, 500));
  }
});

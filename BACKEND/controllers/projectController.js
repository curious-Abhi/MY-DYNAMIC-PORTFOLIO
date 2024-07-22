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
  
    // Ensure all fields are provided
    if (
      !title ||
      !description ||
      !technologies ||
      !deployed
    ) {
      return next(new ErrorHandler("Please Provide All Details!", 400));
    }
  
    // Convert stack and technologies to arrays if they are not already
    const stackArray = Array.isArray(stack) ? stack : stack.split(',');
    const technologiesArray = Array.isArray(technologies) ? technologies : technologies.split(',');
    
  
    // Upload project banner to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      { folder: "PORTFOLIO PROJECT IMAGES" }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
    }
  
    // Insert the new project into the database
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
      stackArray,
      technologiesArray,
      deployed ,
      cloudinaryResponse.public_id,
      cloudinaryResponse.secure_url,
    ];
  
    try {
      const result = await db.query(query, values);
      const newProject = result.rows[0];
      res.status(201).json({
        success: true,
        message: "New Project Added!",
        project: newProject,
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to add project: " + error.message, 500));
    }
  });

  // Update a project
  export const updateProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const projectID = parseInt(id, 10);
    const fields = req.body; // Assuming body-parser is used
   // console.log(fields);
  
    let query = 'UPDATE projects SET ';
    const values = [];
    let counter = 1;
  
    for (const field in fields) {
      if (field !== 'projectBanner') {
        let value = fields[field];
  
        // Handle arrays for stack and technologies
        if (field === 'stack' || field === 'technologies') {
          if (Array.isArray(fields[field])) {
            value = '{' + fields[field].join(',') + '}';
          } else if (typeof fields[field] === 'string') {
            // Optionally convert comma-separated string to array
            value = '{' + fields[field].split(',').join(',') + '}';
          } else {
            return next(new ErrorHandler(`${field} should be an array`, 400));
          }
        }
  
        query += `${field} = $${counter}, `;
        values.push(value);
        counter++;
      }
    }
  
    if (req.files && req.files.projectBanner) {
      const projectBanner = req.files.projectBanner;
      const result = await db.query('SELECT project_banner_public_id FROM projects WHERE id = $1', [id]);
      const projectImageId = result.rows[0]?.project_banner_public_id;
      if (projectImageId) {
        await cloudinary.uploader.destroy(projectImageId);
      }
      const newProjectImage = await cloudinary.uploader.upload(projectBanner.tempFilePath, {
        folder: "PORTFOLIO PROJECT IMAGES",
      });
      query += `project_banner_public_id = $${counter}, project_banner_url = $${counter + 1}, `;
      values.push(newProjectImage.public_id, newProjectImage.secure_url);
      counter += 2;
    }
  
    query = query.slice(0, -2); // Remove the trailing comma and space
    query += ' WHERE id = $' + counter;
    values.push(projectID);
  
    try {
      await db.query(query, values);
      const updatedProject = (await db.query('SELECT * FROM projects WHERE id = $1', [projectID])).rows[0];
      res.status(200).json({
        success: true,
        message: 'Project Updated!',
        project: updatedProject,
      });
    } catch (error) {
      return next(new ErrorHandler('Failed to update project: ' + error.message, 500));
    }
  });
  

  
// Delete a project
export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  //console.log("fronntend:",id)
  const projectId = parseInt(id, 10);


  try {
    const findQuery = 'SELECT * FROM projects WHERE id = $1';
    const findResult = await db.query(findQuery, [projectId]);
    const project = findResult.rows[0];

    if (!project) {
      return next(new ErrorHandler("Already Deleted!", 404));
    }

    const projectImageId = project.project_banner_public_id;
    await cloudinary.uploader.destroy(projectImageId);

    const deleteQuery = 'DELETE FROM projects WHERE id = $1 RETURNING *';
    await db.query(deleteQuery, [projectId]);

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
  // console.log(id)
  // console.log(typeof id)
  const projectID = parseInt(id, 10);


  try {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await db.query(query, [projectID]);
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

import express from 'express';
import { addNewProject, deleteProject, updateProject, getAllProjects, getSingleProject } from "../controllers/projectController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route to add a new project
router.post('/add', isAuthenticated, addNewProject);

// Route to delete a project by ID
router.delete('/delete/:id', isAuthenticated, deleteProject);

// Route to update a project by ID
router.put('/update/:id', isAuthenticated, updateProject);

// Route to get all projects
router.get('/getall', getAllProjects);

// Route to get a single project by ID
router.get('/get/:id', getSingleProject);

export default router;

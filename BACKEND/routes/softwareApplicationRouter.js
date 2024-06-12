import express from 'express';
import { addNewApplication, deleteApplication, getAllApplications } from "../controllers/softwareApplicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route to add a new software application
router.post('/add', isAuthenticated, addNewApplication);

// Route to delete a software application by ID
router.delete('/delete/:id', isAuthenticated, deleteApplication);

// Route to get all software applications
router.get('/getall', getAllApplications);

export default router;

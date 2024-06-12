import express from 'express';
import { addNewSkill, deleteSkill, updateSkill, getAllSkills } from "../controllers/skillController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route to add a new skill
router.post('/add', isAuthenticated, addNewSkill);

// Route to delete a skill by ID
router.delete('/delete/:id', isAuthenticated, deleteSkill);

// Route to update a skill by ID
router.put('/update/:id', isAuthenticated, updateSkill);

// Route to get all skills
router.get('/getall', getAllSkills);

export default router;

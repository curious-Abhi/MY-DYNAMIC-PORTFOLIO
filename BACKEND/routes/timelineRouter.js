// routes/timelineRoutes.js
import express from 'express';
import { postTimeline, deleteTimeline, getAllTimelines } from '../controllers/timelineController.js';
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route to post a new timeline
router.post('/timeline',isAuthenticated, postTimeline);

// Route to delete a timeline by ID
router.delete('/timeline/:id', isAuthenticated,deleteTimeline);

// Route to get all timelines
router.get('/timelines', getAllTimelines);

export default router;

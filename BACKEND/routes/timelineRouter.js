import express from 'express';
import { postTimeline, deleteTimeline, getAllTimelines } from "../controllers/timelineController.js"
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route to post a new timeline
// router.post('/add',isAuthenticated, postTimeline);

router.post('/add', (req, res, next) => {
    console.log('Request body:', req.body);
    next();
  }, isAuthenticated, postTimeline);

// Route to delete a timeline by ID
router.delete('/delete/:id', isAuthenticated,deleteTimeline);

// Route to get all timelines
router.get('/getall', getAllTimelines);

export default router;

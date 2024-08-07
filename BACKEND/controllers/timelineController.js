import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/error.js';
import db from '../database/dbconnection.js';

// Post a new timeline
export const postTimeline = catchAsyncErrors(async (req, res, next) => {
  const { title, description, from_year, to_year } = req.body;

  //console.log("Received data:", { title, description, from, to });

 

  if (!title || !description) {
    return next(new ErrorHandler('Title and description are required', 400));
  }
 
   if (from_year > to_year) {
     return next(new ErrorHandler('The starting year cannot be greater than the ending year', 400));
   }

  const query = `
    INSERT INTO timelines (title, description, from_year, to_year)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [title, description, from_year, to_year];

  try {
    const result = await db.query(query, values);
    const newTimeline = result.rows[0];
    res.status(200).json({
      success: true,
      message: 'Timeline Added!',
      newTimeline,
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to add timeline: ' + error.message, 500));
  }
});
// Delete a timeline
export const deleteTimeline = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const findQuery = 'SELECT * FROM timelines WHERE id = $1';
  const deleteQuery = 'DELETE FROM timelines WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await db.query(findQuery, values);
    const timeline = result.rows[0];

    if (!timeline) {
      return next(new ErrorHandler('Timeline not found', 404));
    }

    await db.query(deleteQuery, values);

    res.status(200).json({
      success: true,
      message: 'Timeline Deleted!',
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to delete timeline: ' + error.message, 500));
  }
});

// Get all timelines
export const getAllTimelines = catchAsyncErrors(async (req, res, next) => {
  const query = 'SELECT * FROM timelines';

  try {
    const result = await db.query(query);
    const timelines = result.rows;
    res.status(200).json({
      success: true,
      timelines,
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to retrieve timelines: ' + error.message, 500));
  }
});

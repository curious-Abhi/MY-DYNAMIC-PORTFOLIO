import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const timelineSlice = createSlice({
  name: "timeline",
  initialState: {
    loading: false,
    timeline: [],
    error: null,
    message: null,
  },
  reducers: {
    getAllTimelineRequest(state) {
      state.timeline = [];
      state.error = null;
      state.loading = true;
    },
    getAllTimelineSuccess(state, action) {
      state.timeline = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllTimelineFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addNewTimelineRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewTimelineSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    addNewTimelineFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    deleteTimelineRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteTimelineSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload.message;
      state.timeline = state.timeline.filter(item => item._id !== action.payload.id);
    },
    deleteTimelineFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetTimelineSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const {
  getAllTimelineRequest,
  getAllTimelineSuccess,
  getAllTimelineFailed,
  addNewTimelineRequest,
  addNewTimelineSuccess,
  addNewTimelineFailed,
  deleteTimelineRequest,
  deleteTimelineSuccess,
  deleteTimelineFailed,
  resetTimelineSlice,
  clearAllErrors,
} = timelineSlice.actions;

export const getAllTimeline = () => async (dispatch) => {
  dispatch(getAllTimelineRequest());
  try {
    const response = await axios.get(
      "http://localhost:4000/api/v1/timeline/getall",
      { withCredentials: true }
    );
    dispatch(getAllTimelineSuccess(response.data.timelines));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(getAllTimelineFailed(error.response.data.message));
  }
};

export const addNewTimeline = (data) => async (dispatch) => {
  dispatch(addNewTimelineRequest());
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/timeline/add",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(addNewTimelineSuccess(response.data.message));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(addNewTimelineFailed(error.response.data.message));
  }
};

export const deleteTimeline = (id) => async (dispatch) => {
  console.log('Deleting timeline with id:', id); // Add this line for debugging
  dispatch(timelineSlice.actions.deleteTimelineRequest());
  try {
    const response = await axios.delete(
      `http://localhost:4000/api/v1/timeline/delete/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(
      timelineSlice.actions.deleteTimelineSuccess(response.data.message)
    );
    dispatch(timelineSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      timelineSlice.actions.deleteTimelineFailed(error.response.data.message)
    );
  }
};


export const resetTimelineSliceAction = () => (dispatch) => {
  dispatch(resetTimelineSlice());
};

export const clearAllTimelineErrors = () => (dispatch) => {
  dispatch(clearAllErrors());
};

export default timelineSlice.reducer;

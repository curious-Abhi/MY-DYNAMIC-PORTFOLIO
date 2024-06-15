import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const forgotResetPassSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message=null;
    },
    forgotPasswordSuccess(state, action) {
        state.loading = false;
        state.error = null;
        state.message=null;
    },
    forgotPasswordFailed(state, action) {
        state.loading = true;
        state.error = null;
        state.message=null;
    },
    loadUserRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loadUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loadUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    updateProfileResetAfterUpdate(state, action) {
      state.error = null;
      state.message = null;
      state.isUpdated = false;
    },

    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const login = (credentials) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const { data } = await axios.post(
      "http://localhost:4000/api/v1/user/login",
      credentials,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(userSlice.actions.loginSuccess(data.user));
  } catch (error) {
    dispatch(userSlice.actions.loginFailed(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(userSlice.actions.loadUserRequest());
  try {
    const { data } = await axios.get("http://localhost:4000/api/v1/user/me", {
      withCredentials: true,
    });
    dispatch(userSlice.actions.loadUserSuccess(data.user));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.loadUserFailed(error.response.data.message));
  }
};
export const logout = () => async (dispatch) => {
  dispatch(userSlice.actions.loadUserRequest());
  try {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/user/logout",
      { withCredentials: true }
    );
    dispatch(userSlice.actions.logoutSuccess(data.message));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed(error.response.data.message));
  }
};

export const updatePassword = ( currentPassword, newPassword, confirmNewPassword) => async (dispatch) => {
    dispatch(userSlice.actions.updatePasswordRequest());
    try {
      const { data } = await axios.put(
        "http://localhost:4000/api/v1/user/password/update",
        { currentPassword, newPassword, confirmNewPassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(userSlice.actions.updatePasswordSuccess(data.message));
      dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(
        userSlice.actions.updatePasswordFailed(error.response.data.message)
      );
    }
  };
export const updateProfile = ( data) => async (dispatch) => {
    dispatch(userSlice.actions.updateProfileRequest());
    try {
      const { data } = await axios.put(
        "http://localhost:4000/api/v1/user/me/profile/update",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      dispatch(userSlice.actions.updateProfileSuccess(data.message));
      dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(
        userSlice.actions.updateProfileFailed(error.response.data.message)
      );
    }
  };


  export const resetProfile=()=>(dispatch)=>{
    dispatch(userSlice.actions.updateProfileResetAfterUpdate())
  }

export const clearAllUsersErrors = () => (dispatch) => {
  dispatch(userSlice.actions.clearAllErrors());
};

export default userSlice.reducer;

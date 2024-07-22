import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const certificateslice = createSlice({
  name: "certificates",
  initialState: {
    loading: false,
    certificates: [],
    error: null,
    message: null,
  },
  reducers: {
    getAllcertificatesRequest(state, action) {
      state.certificates = [];
      state.error = null;
      state.loading = true;
    },
    getAllcertificatesSuccess(state, action) {
      state.certificates = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllcertificatesFailed(state, action) {
      state.certificates = state.certificates;
      state.error = action.payload;
      state.loading = false;
    },
    addNewcertificatesRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewcertificatesSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    addNewcertificatesFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    deletecertificatesRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deletecertificatesSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deletecertificatesFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetcertificateslice(state, action) {
      state.error = null;
      state.certificates = state.certificates;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state, action) {
      state.error = null;
      state.certificates = state.certificates;
    },
  },
});

export const getAllcertificates = () => async (dispatch) => {
  dispatch(
    certificateslice.actions.getAllcertificatesRequest()
  );
  try {
    const response = await axios.get(
      "http://localhost:4000/api/v1/softwareapplication/getall",
      { withCredentials: true }
    );
    dispatch(
      certificateslice.actions.getAllcertificatesSuccess(
        response.data.certificates
      )
    );
    dispatch(certificateslice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      certificateslice.actions.getAllcertificatesFailed(
        error.response.data.message
      )
    );
  }
};

export const addNewSoftwareApplication = (formdata) => async (dispatch) => {
  dispatch(
    certificateslice.actions.addNewcertificatesRequest()
  );
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/softwareapplication/add",
      formdata,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(
      certificateslice.actions.addNewcertificatesSuccess(
        response.data.message
      )
    );
    dispatch(certificateslice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      certificateslice.actions.addNewcertificatesFailed(
        error.response.data.message
      )
    );
  }
};

export const deleteSoftwareApplication = (id) => async (dispatch) => {
  dispatch(
    certificateslice.actions.deletecertificatesRequest()
  );
  try {
    const response = await axios.delete(
      `http://localhost:4000/api/v1/softwareapplication/delete/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(
      certificateslice.actions.deletecertificatesSuccess(
        response.data.message
      )
    );
    dispatch(certificateslice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      certificateslice.actions.deletecertificatesFailed(
        error.response.data.message
      )
    );
  }
};

export const clearAllSoftwareAppErrors = () => (dispatch) => {
  dispatch(certificateslice.actions.clearAllErrors());
};

export const resetcertificateslice = () => (dispatch) => {
  dispatch(certificateslice.actions.resetcertificateslice());
};

export default certificateslice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const certificateSlice = createSlice({
  name: "certificates",
  initialState: {
    loading: false,
    certificates: [],
    error: null,
    message: null,
  },
  reducers: {
    getAllCertificatesRequest(state) {
      state.certificates = [];
      state.error = null;
      state.loading = true;
    },
    getAllCertificatesSuccess(state, action) {
      state.certificates = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllCertificatesFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addNewCertificateRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewCertificateSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    addNewCertificateFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    deleteCertificateRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteCertificateSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deleteCertificateFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetCertificateState(state) {
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
  getAllCertificatesRequest,
  getAllCertificatesSuccess,
  getAllCertificatesFailed,
  addNewCertificateRequest,
  addNewCertificateSuccess,
  addNewCertificateFailed,
  deleteCertificateRequest,
  deleteCertificateSuccess,
  deleteCertificateFailed,
  resetCertificateState,
  clearAllErrors,
} = certificateSlice.action

export const getAllCertificates = () => async (dispatch) => {
  dispatch(getAllCertificatesRequest());
  try {
    const response = await axios.get(
      "http://localhost:4000/api/v1/certificate/getall",
      { withCredentials: true }
    );
    dispatch(getAllCertificatesSuccess(response.data.certificates));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(getAllCertificatesFailed(error.response.data.message));
  }
};

export const addNewCertificate = (formData) => async (dispatch) => {
  dispatch(addNewCertificateRequest());
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/certificate/add",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(addNewCertificateSuccess(response.data.message));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(addNewCertificateFailed(error.response.data.message));
  }
};

export const deleteCertificate = (id) => async (dispatch) => {
  dispatch(deleteCertificateRequest());
  try {
    const response = await axios.delete(
      `http://localhost:4000/api/v1/certificate/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(deleteCertificateSuccess(response.data.message));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(deleteCertificateFailed(error.response.data.message));
  }
};

export const clearAllCertificateErrors = () => (dispatch) => {
  dispatch(clearAllErrors());
};

export const resetCertificateStateAction = () => (dispatch) => {
  dispatch(resetCertificateState());
};

export default certificateSlice.reducer;

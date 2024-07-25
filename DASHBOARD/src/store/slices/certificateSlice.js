import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Certificateslice = createSlice({
  name: "certificates",
  initialState: {
    loading: false,
    certificates: [], 
    error: null,
    message: null,
  },
  reducers: {
    getAllCertificatesRequest(state) {
      state.certificates = []; // Consistent with initialState
      state.error = null;
      state.loading = true;
    },
    getAllCertificatesSuccess(state, action) {
      state.certificates = action.payload; // Consistent with initialState
      state.error = null;
      state.loading = false;
    },
    getAllCertificatesFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addNewCertificatesRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewCertificatesSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    addNewCertificatesFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    deleteCertificatesRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteCertificatesSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deleteCertificatesFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetCertificatesSlice(state) {
      state.error = null;
      state.certificates = []; // Reset to initial state
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
  addNewCertificatesRequest,
  addNewCertificatesSuccess,
  addNewCertificatesFailed,
  deleteCertificatesRequest,
  deleteCertificatesSuccess,
  deleteCertificatesFailed,
  resetCertificatesSlice,
  clearAllErrors,
} = Certificateslice.actions;

export const getAllCertificates = () => async (dispatch) => {
  dispatch(getAllCertificatesRequest());
  try {
    const response = await axios.get(
      "http://localhost:4000/api/v1/certificate/getall",
      { withCredentials: true }
    );
    dispatch(getAllCertificatesSuccess(response.data.certificates)); // Ensure the payload is correct
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(getAllCertificatesFailed(error.response.data.message));
  }
};

export const addNewCertificate = (formdata) => async (dispatch) => {
  dispatch(addNewCertificatesRequest());
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/certificate/add",
      formdata,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(addNewCertificatesSuccess(response.data.message));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(addNewCertificatesFailed(error.response.data.message));
  }
};

export const deleteCertificate = (id) => async (dispatch) => {
  dispatch(deleteCertificatesRequest());
  try {
    const response = await axios.delete(
      `http://localhost:4000/api/v1/certificate/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(deleteCertificatesSuccess(response.data.message));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(deleteCertificatesFailed(error.response.data.message));
  }
};

export const clearAllCertificateErrors = () => (dispatch) => {
  dispatch(clearAllErrors());
};

export default Certificateslice.reducer;

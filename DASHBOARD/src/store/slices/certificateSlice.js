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
      console.log("getAllCertificatesRequest dispatched");
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
      state.certificates=state.certificates;
      state.error = action.payload;
      state.loading = false;
    },
    addNewCertificateRequest(state,action) {
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
      state.certificates = state.certificates;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
      state.certificates=state.certificates;
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
} = certificateSlice.actions;


export const getAllCertificates = () => async (dispatch) => {
  dispatch(certificateSlice.actions.getAllCertificatesRequest());
  try {
    const response = await axios.get(
      "http://localhost:4000/api/v1/certificate/getall",
      { withCredentials: true }
    );
    dispatch(certificateSlice.actions.getAllCertificatesSuccess(response.data.certificates));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(certificateSlice.actions.getAllCertificatesFailed(error.response.data.message));
  }
};

export const addNewCertificate = (formData) => async (dispatch) => {
  dispatch(certificateSlice.actions.addNewCertificateRequest());
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/certificate/add",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(certificateSlice.actions.addNewCertificateSuccess(response.data.message));
    dispatch(certificateSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(certificateSlice.actions.addNewCertificateFailed(error.response.data.message));
  }
};

export const deleteCertificate = (id) => async (dispatch) => {
  dispatch(certificateSlice.actions.deleteCertificateRequest());
  try {
    const response = await axios.delete(
      `http://localhost:4000/api/v1/certificate/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(certificateSlice.actions.deleteCertificateSuccess(response.data.message));
    dispatch(certificateSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(certificateSlice.actions.deleteCertificateFailed(error.response.data.message));
  }
};

export const clearAllCertificateErrors = () => (dispatch) => {
  dispatch(certificateSlice.actions.clearAllErrors());
};

export const resetCertificateStateAction = () => (dispatch) => { 
  dispatch(certificateSlice.actions.resetCertificateState());
};

export default certificateSlice.reducer;

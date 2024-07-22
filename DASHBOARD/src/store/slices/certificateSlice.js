import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Certificateslice = createSlice({
  name: "Certificates",
  initialState: {
    loading: false,
    Certificates: [],
    error: null,
    message: null,
  },
  reducers: {
    getAllCertificatesRequest(state, action) {
      state.Certificates = [];
      state.error = null;
      state.loading = true;
    },
    getAllCertificatesSuccess(state, action) {
      state.Certificates = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllCertificatesFailed(state, action) {
      state.Certificates = state.Certificates;
      state.error = action.payload;
      state.loading = false;
    },
    addNewCertificatesRequest(state, action) {
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
    deleteCertificatesRequest(state, action) {
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
    resetCertificateslice(state, action) {
      state.error = null;
      state.Certificates = state.Certificates;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state, action) {
      state.error = null;
      state.Certificates = state.Certificates;
    },
  },
});

export const getAllCertificates = () => async (dispatch) => {
  dispatch(
    Certificateslice.actions.getAllCertificatesRequest()
  );
  try {
    const response = await axios.get(
      "http://localhost:4000/api/v1/softwareapplication/getall",
      { withCredentials: true }
    );
    dispatch(
      Certificateslice.actions.getAllCertificatesSuccess(
        response.data.Certificates
      )
    );
    dispatch(Certificateslice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      Certificateslice.actions.getAllCertificatesFailed(
        error.response.data.message
      )
    );
  }
};

export const addNewCertificate= (formdata) => async (dispatch) => {
  dispatch(
    Certificateslice.actions.addNewCertificatesRequest()
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
      Certificateslice.actions.addNewCertificatesSuccess(
        response.data.message
      )
    );
    dispatch(Certificateslice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      Certificateslice.actions.addNewCertificatesFailed(
        error.response.data.message
      )
    );
  }
};

export const deleteCertificate= (id) => async (dispatch) => {
  dispatch(
    Certificateslice.actions.deleteCertificatesRequest()
  );
  try {
    const response = await axios.delete(
      `http://localhost:4000/api/v1/softwareapplication/delete/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(
      Certificateslice.actions.deleteCertificatesSuccess(
        response.data.message
      )
    );
    dispatch(Certificateslice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      Certificateslice.actions.deleteCertificatesFailed(
        error.response.data.message
      )
    );
  }
};

export const clearAllSoftwareAppErrors = () => (dispatch) => {
  dispatch(Certificateslice.actions.clearAllErrors());
};

export const resetCertificateslice = () => (dispatch) => {
  dispatch(Certificateslice.actions.resetCertificateslice());
};

export default Certificateslice.reducer;

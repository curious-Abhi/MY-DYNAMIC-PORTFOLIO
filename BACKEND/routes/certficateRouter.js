import express from "express"
import { addNewCertificate,deleteCertificate,getAllCertificates } from "../controllers/certificateController"
import { isAuthenticated } from "../middlewares/auth";

const router=express.Router;
import express from "express"
import { addNewCertificate,deleteCertificate,getAllCertificates } from "../controllers/certificateController"
import { isAuthenticated } from "../middlewares/auth";

const router=express.Router;

// Route to add a new certificate
router.post('/add', isAuthenticated, addNewCertificate);

// Route to delete a software application by ID
router.delete('/delete/:id', isAuthenticated, deleteApplication);

// Route to get all software applications
router.get('/getall', getAllApplications);

export default router;

import express from "express"
import { addNewCertificate,deleteCertificate,getAllCertificates } from "../controllers/certificateController.js"
import { isAuthenticated } from "../middlewares/auth.js";

const router=express.Router();

// Route to add a new certificate
router.post('/add', isAuthenticated, addNewCertificate);

// Route to delete a certificate by ID
router.delete('/delete/:id', isAuthenticated, deleteCertificate);

// Route to get all certificate
router.get('/getall', getAllCertificates);

export default router;

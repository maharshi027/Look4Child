import express from "express";
import { downloadCertificate } from "../controllers/certificate.controller.js";

const router = express.Router();

router.get("/download-certificate/:id", downloadCertificate);

export default router;

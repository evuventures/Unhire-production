import express from 'express';
import upload from '../utils/fileUpload.js';
import { parseResume } from '../controllers/utils.controller.js';

const router = express.Router();

router.post('/resume-parse', upload.single('resume'), parseResume);

export default router;

import { Router } from 'express';
import { classifyWasteText } from '../controllers/aiController.js';

const router = Router();

router.post('/classify', classifyWasteText);

export default router;

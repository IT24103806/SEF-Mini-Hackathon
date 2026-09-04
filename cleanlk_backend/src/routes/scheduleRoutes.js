import { Router } from 'express';
import { getSchedules, getScheduleByArea } from '../controllers/scheduleController.js';

const router = Router();

router.get('/', getSchedules);
router.get('/area/:area', getScheduleByArea);

export default router;

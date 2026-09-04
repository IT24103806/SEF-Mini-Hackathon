import { Router } from 'express';
import {
  getSchedules,
  getScheduleById,
  getScheduleByArea,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/scheduleController.js';

const router = Router();

router.get('/', getSchedules);
router.get('/area/:area', getScheduleByArea);
router.get('/:id', getScheduleById);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;

import { Router } from 'express';
import {
  getAllReports,
  getReportById,
  createReport,
  updateReportStatus,
  getReportStats,
} from '../controllers/reportController.js';
import { validateReport } from '../middlewares/validateReport.js';

const router = Router();

router.get('/', getAllReports);
router.get('/stats', getReportStats);
router.get('/:id', getReportById);
router.post('/', validateReport, createReport);
router.patch('/:id/status', updateReportStatus);

export default router;

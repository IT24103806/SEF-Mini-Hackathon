import { Router } from 'express';
import {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  updateReportStatus,
  deleteReport,
  getReportStats,
} from '../controllers/reportController.js';
import { validateReport } from '../middlewares/validateReport.js';

const router = Router();

router.get('/', getAllReports);
router.get('/stats', getReportStats);
router.get('/:id', getReportById);
router.post('/', validateReport, createReport);
router.put('/:id', validateReport, updateReport);
router.patch('/:id/status', updateReportStatus);
router.delete('/:id', deleteReport);

export default router;


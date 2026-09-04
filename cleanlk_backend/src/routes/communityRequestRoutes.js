import { Router } from 'express';
import {
  getAllCommunityRequests,
  getCommunityRequestById,
  createCommunityRequest,
  updateCommunityRequest,
  updateCommunityRequestStatus,
  deleteCommunityRequest,
} from '../controllers/communityRequestController.js';

const router = Router();

router.get('/', getAllCommunityRequests);
router.get('/:id', getCommunityRequestById);
router.post('/', createCommunityRequest);
router.put('/:id', updateCommunityRequest);
router.patch('/:id/status', updateCommunityRequestStatus);
router.delete('/:id', deleteCommunityRequest);

export default router;

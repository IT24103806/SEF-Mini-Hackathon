import express from 'express';
import { 
  getCommunityRequests, 
  createCommunityRequest, 
  updateCommunityRequest, 
  deleteCommunityRequest 
} from '../controllers/communityController.js';

const router = express.Router();

router.get('/', getCommunityRequests);
router.post('/', createCommunityRequest);
router.put('/:id', updateCommunityRequest);
router.delete('/:id', deleteCommunityRequest);

export default router;
import express from 'express';
import {
  createCommentOnPost,
  editCommentOnPost,
  deleteCommentFromPost,
} from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createCommentOnPost);

router
  .route('/:id')
  .put(protect, editCommentOnPost)
  .delete(protect, deleteCommentFromPost);

export default router;

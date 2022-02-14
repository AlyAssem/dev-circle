import express from 'express';
import {
  getPosts,
  createPost,
  updatePost,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  getPostComments,
} from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);

router
  .route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like').get(protect, likePost);

router.route('/:id/unlike').get(protect, unlikePost);

router.route('/:id/comments').get(getPostComments);

export default router;

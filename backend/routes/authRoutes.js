import express from 'express';
import { registerUser, loginUser, logoutUser, getUserHistory } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/history', protect, getUserHistory);

export default router;

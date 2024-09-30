import { Router } from 'express';
import authRoutes from './authRoutes';
import  verifyRoutes  from './verifyRoutes';
import  passwordRoutes  from './passwordRoutes';
import clashRoutes from './clashRoutes';
import authMiddleware from '../middlewares/authMiddleware';
const router = Router();

router.use('/api/auth', authRoutes);
router.use('/', verifyRoutes);
router.use('/api/auth', passwordRoutes);
router.use('/api/clash', clashRoutes);


export default router;  // Export the router to be used in other files
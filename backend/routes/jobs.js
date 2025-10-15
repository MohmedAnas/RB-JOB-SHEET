import express from 'express';
import jobsController from '../controllers/jobsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router(); // <-- This line is REQUIRED

// Public routes (customer access)
router.get('/search', jobsController.searchJobs);
router.get('/:id', jobsController.getJobById);
router.get('/:id/invoice', jobsController.downloadInvoice);

// Protected routes (admin only)
router.get('/', authMiddleware, jobsController.getAllJobs);
router.post('/', authMiddleware, jobsController.createJob);
router.put('/:id', authMiddleware, jobsController.updateJob);
router.delete('/:id', authMiddleware, jobsController.deleteJob);
router.patch('/:id/status', authMiddleware, jobsController.updateJobStatus);
router.get('/analytics/dashboard', authMiddleware, jobsController.getDashboardStats);

export default router;

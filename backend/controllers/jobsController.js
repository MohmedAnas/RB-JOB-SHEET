import { getSheetData, appendRow, updateRow, deleteRow } from '../utils/sheetHelper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// You need this to get __dirname in ES Modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jobsController = {
  // Get all jobs
  async getAllJobs(req, res) {
    console.log('📋 GET /api/jobs - Fetching all jobs');
    try {
      const jobs = await getSheetData();
      res.json({ success: true, data: jobs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get job by ID
  async getJobById(req, res) {
    try {
      const { id } = req.params;
      const jobs = await getSheetData();
      const job = jobs.find(job => job.uid === id);

      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }

      res.json({ success: true, data: job });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Search jobs by mobile number or job ID
  async searchJobs(req, res) {
    try {
      const { q } = req.query;
      const jobs = await getSheetData();
      const results = jobs.filter(job =>
        job.uid.toLowerCase().includes(q.toLowerCase()) ||
        job.mobileNumber.includes(q) ||
        job.customerName.toLowerCase().includes(q.toLowerCase())
      );
      res.json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create new job
  async createJob(req, res) {
    try {
      console.log('📝 Creating new job...');
      console.log('Request body:', req.body);
      console.log('🔍 BACKEND: Components received:', req.body.components);
      console.log('🔍 BACKEND: Components type:', typeof req.body.components);

      const jobData = {
        customerName: req.body.customerName,
        mobileNumber: req.body.mobileNumber,
        mobileModel: req.body.mobileModel,
        issue: req.body.issue,
        customIssue: req.body.customIssue || '',
        components: req.body.components || '',
        entryDate: req.body.entryDate || new Date().toISOString().split('T')[0],
        expectedDate: req.body.expectedDate,
        status: req.body.status || 'Pending',
        notes: req.body.notes || '',
        totalAmount: req.body.totalAmount || ''
      };

      console.log('Job data to save:', jobData);

      const newJob = await appendRow(jobData);
      console.log('✅ Job created successfully:', newJob);

      res.status(201).json({ success: true, data: newJob });
    } catch (error) {
      console.error('❌ Error creating job:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update job
  async updateJob(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedJob = await updateRow(id, updateData);
      res.json({ success: true, data: updatedJob });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete job
  async deleteJob(req, res) {
    try {
      const { id } = req.params;
      const result = await deleteRow(id);
      res.json({ success: true, message: result.message });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update job status
  async updateJobStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updateData = { status };

      if (status === 'Completed') {
        updateData.completionDate = new Date().toISOString().split('T')[0];
      }

      const updatedJob = await updateRow(id, updateData);
      res.json({ success: true, data: updatedJob });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get dashboard analytics
  async getDashboardStats(req, res) {
    try {
      const jobs = await getSheetData();

      const stats = {
        total: jobs.length,
        pending: jobs.filter(job => job.status === 'Pending').length,
        inProgress: jobs.filter(job => job.status === 'In Progress').length,
        completed: jobs.filter(job => job.status === 'Completed').length,
        recentJobs: jobs.slice(-5).reverse()
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Download invoice for completed job
  async downloadInvoice(req, res) {
    try {
      const { id } = req.params;
      const jobs = await getSheetData();
      const job = jobs.find(job => job.uid === id);

      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }

      if (job.status !== 'Completed') {
        return res.status(400).json({ success: false, error: 'Invoice only available for completed jobs' });
      }

      // Read the new HTML template
      const templatePath = path.join(__dirname, '../templates/invoice-new.html');
      let htmlContent = fs.readFileSync(templatePath, 'utf8');

      // Replace placeholders with actual job data from Google Sheets
      htmlContent = htmlContent
        .replace('J-RB-2025-1008', job.uid)
        .replace('Ms. Jane Doe', job.customerName)
        .replace('iPhone 14 Pro (Serial: P304S-092)', job.mobileModel)
        .replace('October 09, 2025', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
        .replace('Display Replacement (AMOLED Panel)', job.issue)
        .replace('INR 7,200.00', `INR ${job.totalAmount || '0.00'}`);

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="Invoice_${job.uid}.html"`);
      res.send(htmlContent);

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export default jobsController;

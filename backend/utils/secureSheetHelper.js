import { getSheet } from '../config/googleSheet.js';
import crypto from 'crypto';

// Input validation schemas
const jobSchema = {
  jobId: { type: 'string', maxLength: 20, pattern: /^[A-Z0-9]+$/ },
  customerName: { type: 'string', maxLength: 100, required: true },
  mobile: { type: 'string', pattern: /^\d{10}$/, required: true },
  deviceModel: { type: 'string', maxLength: 50, required: true },
  issue: { type: 'string', maxLength: 500, required: true },
  status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed', 'Delivered'] },
  totalAmount: { type: 'number', min: 0, max: 999999 }
};

// Sanitize input data
function sanitizeInput(data) {
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove potentially harmful characters
      sanitized[key] = value.replace(/[<>\"'&]/g, '').trim();
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Validate data against schema
function validateJobData(data) {
  const errors = [];
  
  for (const [field, rules] of Object.entries(jobSchema)) {
    const value = data[field];
    
    if (rules.required && (!value || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    if (value) {
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`);
      }
      
      if (rules.type === 'number' && (isNaN(value) || typeof Number(value) !== 'number')) {
        errors.push(`${field} must be a valid number`);
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} exceeds maximum length of ${rules.maxLength}`);
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
      
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }
      
      if (rules.min !== undefined && Number(value) < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }
      
      if (rules.max !== undefined && Number(value) > rules.max) {
        errors.push(`${field} exceeds maximum value of ${rules.max}`);
      }
    }
  }
  
  return errors;
}

// Generate secure job ID
function generateJobId() {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `RB${timestamp}${random}`.substring(0, 12);
}

// Secure data operations
export async function secureAddJob(jobData) {
  try {
    // Sanitize input
    const sanitizedData = sanitizeInput(jobData);
    
    // Validate data
    const validationErrors = validateJobData(sanitizedData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    // Generate secure job ID if not provided
    if (!sanitizedData.jobId) {
      sanitizedData.jobId = generateJobId();
    }
    
    // Add timestamp and tracking
    sanitizedData.entryDate = new Date().toLocaleDateString('en-GB');
    sanitizedData.lastModified = new Date().toISOString();
    
    const sheet = await getSheet();
    
    // Check for duplicate job ID
    const rows = await sheet.getRows();
    const existingJob = rows.find(row => row.get('Job ID') === sanitizedData.jobId);
    if (existingJob) {
      throw new Error('Job ID already exists');
    }
    
    // Add row with validated data
    await sheet.addRow({
      'Job ID': sanitizedData.jobId,
      'Customer Name': sanitizedData.customerName,
      'Mobile': sanitizedData.mobile,
      'Device Model': sanitizedData.deviceModel,
      'Issue': sanitizedData.issue,
      'Status': sanitizedData.status || 'Pending',
      'Entry Date': sanitizedData.entryDate,
      'Total Amount': sanitizedData.totalAmount || 0,
      'Components': sanitizedData.components || '',
      'Last Modified': sanitizedData.lastModified
    });
    
    console.log(`[${new Date().toISOString()}] Secure job added: ${sanitizedData.jobId}`);
    return { success: true, jobId: sanitizedData.jobId };
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Secure add job failed:`, error.message);
    throw error;
  }
}

export async function secureGetJobs(filters = {}) {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    
    let jobs = rows.map(row => ({
      jobId: row.get('Job ID') || '',
      customerName: row.get('Customer Name') || '',
      mobile: row.get('Mobile') || '',
      deviceModel: row.get('Device Model') || '',
      issue: row.get('Issue') || '',
      status: row.get('Status') || 'Pending',
      entryDate: row.get('Entry Date') || '',
      totalAmount: parseFloat(row.get('Total Amount')) || 0,
      components: row.get('Components') || '',
      lastModified: row.get('Last Modified') || ''
    }));
    
    // Apply filters securely
    if (filters.jobId) {
      const sanitizedJobId = filters.jobId.replace(/[<>\"'&]/g, '').trim();
      jobs = jobs.filter(job => job.jobId.toLowerCase().includes(sanitizedJobId.toLowerCase()));
    }
    
    if (filters.mobile) {
      const sanitizedMobile = filters.mobile.replace(/[^\d]/g, '');
      jobs = jobs.filter(job => job.mobile.includes(sanitizedMobile));
    }
    
    console.log(`[${new Date().toISOString()}] Secure jobs retrieved: ${jobs.length} records`);
    return jobs;
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Secure get jobs failed:`, error.message);
    throw error;
  }
}

export async function secureUpdateJob(jobId, updateData) {
  try {
    // Sanitize inputs
    const sanitizedJobId = jobId.replace(/[<>\"'&]/g, '').trim();
    const sanitizedData = sanitizeInput(updateData);
    
    // Validate update data
    const validationErrors = validateJobData(sanitizedData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    const jobRow = rows.find(row => row.get('Job ID') === sanitizedJobId);
    
    if (!jobRow) {
      throw new Error('Job not found');
    }
    
    // Update with timestamp
    sanitizedData.lastModified = new Date().toISOString();
    
    // Update allowed fields only
    const allowedFields = ['Customer Name', 'Mobile', 'Device Model', 'Issue', 'Status', 'Total Amount', 'Components'];
    const fieldMapping = {
      customerName: 'Customer Name',
      mobile: 'Mobile',
      deviceModel: 'Device Model',
      issue: 'Issue',
      status: 'Status',
      totalAmount: 'Total Amount',
      components: 'Components'
    };
    
    for (const [key, value] of Object.entries(sanitizedData)) {
      const sheetField = fieldMapping[key];
      if (sheetField && allowedFields.includes(sheetField)) {
        jobRow.set(sheetField, value);
      }
    }
    
    jobRow.set('Last Modified', sanitizedData.lastModified);
    await jobRow.save();
    
    console.log(`[${new Date().toISOString()}] Secure job updated: ${sanitizedJobId}`);
    return { success: true };
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Secure update job failed:`, error.message);
    throw error;
  }
}

export async function secureDeleteJob(jobId) {
  try {
    const sanitizedJobId = jobId.replace(/[<>\"'&]/g, '').trim();
    
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    const jobRow = rows.find(row => row.get('Job ID') === sanitizedJobId);
    
    if (!jobRow) {
      throw new Error('Job not found');
    }
    
    await jobRow.delete();
    
    console.log(`[${new Date().toISOString()}] Secure job deleted: ${sanitizedJobId}`);
    return { success: true };
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Secure delete job failed:`, error.message);
    throw error;
  }
}

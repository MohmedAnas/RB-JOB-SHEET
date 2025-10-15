// utils/sheetHelper.js (ES Module)
import { getSheet, getAdminSheet, initializeSheet } from '../config/googleSheet.js';

// Helper function to format date as dd/mm/yyyy
function formatDateToDDMMYYYY(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Generate unique job ID
export async function generateJobId() {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();

    let maxId = 0;
    rows.forEach(row => {
      if (row.get('Job Sheet ID')) {
        const match = row.get('Job Sheet ID').match(/RB(\d+)/);
        if (match) {
          const num = parseInt(match[1]);
          if (num > maxId) maxId = num;
        }
      }
    });

    return `RB${String(maxId + 1).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating job ID:', error);
    return `RB${Date.now().toString().slice(-6)}`;
  }
}

// Get all jobs from sheet
export async function getSheetData() {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    
    if (rows.length > 0) {
      console.log('📋 Debug: First row data:', {
        'Job Sheet ID': rows[0].get('Job Sheet ID'),
        'Customer': rows[0].get('Customer'),
        'Status': rows[0].get('Status'),
        'Components': rows[0].get('Components')
      });
    }

    return rows.map(row => {
      const status = row.get('Status') || 'Pending';
      // Normalize status to proper case
      const normalizedStatus = status.toLowerCase() === 'completed' ? 'Completed' :
                              status.toLowerCase() === 'in progress' ? 'In Progress' :
                              status.toLowerCase() === 'pending' ? 'Pending' : status;
      
      return {
        uid: row.get('Job Sheet ID') || '',
        customerName: row.get('Customer Name') || '',
        mobileNumber: row.get('Mobile Number') || '',
        mobileModel: row.get('Mobile Model') || '',
        issue: row.get('Issue Description') || '',
        customIssue: '',
        components: row.get('Components') || '',
        entryDate: row.get('Entry Date') || '',
        expectedDate: row.get('Completed Date') || '',
        status: normalizedStatus,
        completionDate: row.get('Completed Date') || '',
        notes: row.get('Comments') || '',
        totalAmount: row.get('Total Amount') || '0.00'
      };
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

// Add new job to sheet
export async function appendRow(jobData) {
  try {
    const sheet = await getSheet();

    if (!jobData.uid) {
      jobData.uid = await generateJobId();
    }

    if (!jobData.entryDate) {
      jobData.entryDate = formatDateToDDMMYYYY();
    }

    // Use array format to ensure correct column order
    // Order: Job Sheet ID, Customer Name, Mobile Number, Mobile Model, Issue Description, Components, Status, Entry Date, Completed Date, Total Amount, Comments
    const rowValues = [
      jobData.uid,                                                                    // Job Sheet ID
      jobData.customerName,                                                          // Customer Name
      jobData.mobileNumber,                                                          // Mobile Number
      jobData.mobileModel,                                                           // Mobile Model
      jobData.issue + (jobData.customIssue ? ` - ${jobData.customIssue}` : ''),   // Issue Description
      jobData.components || '',                                                      // Components
      jobData.status || 'Pending',                                                  // Status
      jobData.entryDate,                                                            // Entry Date
      jobData.expectedDate || '',                                                   // Completed Date
      jobData.totalAmount || '',                                                    // Total Amount
      jobData.notes || ''                                                           // Comments
    ];

    const newRow = await sheet.addRow(rowValues);

    // Return the original data since newRow might be undefined
    return {
      uid: jobData.uid,
      customerName: jobData.customerName,
      mobileNumber: jobData.mobileNumber,
      mobileModel: jobData.mobileModel,
      issue: jobData.issue,
      customIssue: jobData.customIssue || '',
      components: jobData.components || '',
      entryDate: jobData.entryDate,
      expectedDate: jobData.expectedDate,
      status: jobData.status || 'Pending',
      completionDate: jobData.completionDate || '',
      notes: jobData.notes || ''
    };
  } catch (error) {
    console.error('❌ Error in appendRow:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

// Update existing job in sheet
export async function updateRow(uid, updatedData) {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();

    const rowToUpdate = rows.find(row => row.get('Job Sheet ID') === uid);
    if (!rowToUpdate) {
      throw new Error(`Job with ID ${uid} not found`);
    }

    // Map frontend field names to sheet headers
    const headerMap = {
      'customerName': 'Customer Name',
      'mobileNumber': 'Mobile Number', 
      'mobileModel': 'Mobile Model',
      'issue': 'Issue Description',
      'components': 'Components',
      'status': 'Status',
      'entryDate': 'Entry Date',
      'expectedDate': 'Completed Date',
      'completionDate': 'Completed Date',
      'notes': 'Comments',
      'totalAmount': 'Total Amount'
    };

    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] !== undefined && headerMap[key]) {
        rowToUpdate.set(headerMap[key], updatedData[key]);
      }
    });

    // Auto-set completion date when status changes to Completed
    if (updatedData.status === 'Completed' && !updatedData.completionDate) {
      rowToUpdate.set('Completed Date', formatDateToDDMMYYYY());
    }

    await rowToUpdate.save();

    return {
      uid: rowToUpdate.get('Job Sheet ID'),
      customerName: rowToUpdate.get('Customer Name'),
      mobileNumber: rowToUpdate.get('Mobile Number'),
      mobileModel: rowToUpdate.get('Mobile Model'),
      issue: rowToUpdate.get('Issue Description'),
      customIssue: '',
      components: rowToUpdate.get('Components') || '',
      entryDate: rowToUpdate.get('Entry Date'),
      expectedDate: rowToUpdate.get('Completed Date'),
      status: rowToUpdate.get('Status'),
      completionDate: rowToUpdate.get('Completed Date') || '',
      notes: rowToUpdate.get('Comments'),
      totalAmount: rowToUpdate.get('Total Amount') || ''
    };
  } catch (error) {
    console.error('Error updating row in sheet:', error);
    throw error;
  }
}

// Delete job from sheet
export async function deleteRow(uid) {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();

    const rowToDelete = rows.find(row => row.get('Job Sheet ID') === uid);
    if (!rowToDelete) {
      throw new Error(`Job with ID ${uid} not found`);
    }

    await rowToDelete.delete();
    return { success: true, message: `Job ${uid} deleted successfully` };
  } catch (error) {
    console.error('Error deleting row from sheet:', error);
    throw error;
  }
}

// Initialize sheet on first run
export async function initSheet() {
  try {
    await initializeSheet();
  } catch (error) {
    throw error;
  }
}

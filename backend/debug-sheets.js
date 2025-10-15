import { getSheet } from './config/googleSheet.js';

async function debugSheets() {
  try {
    console.log('🔍 Debugging sheet connection...');
    
    const sheet = await getSheet();
    console.log('Sheet title:', sheet.title);
    console.log('Sheet ID:', sheet.sheetId);
    
    // Add a test row directly
    const testRow = await sheet.addRow({
      uid: 'DEBUG001',
      customerName: 'Debug Test',
      mobileNumber: '1111111111',
      mobileModel: 'Debug Phone',
      issue: 'Debug Issue',
      customIssue: '',
      entryDate: new Date().toISOString().split('T')[0],
      expectedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      completionDate: '',
      notes: 'Debug test entry'
    });
    
    console.log('✅ Debug row added:', testRow.get('uid'));
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugSheets();

import { appendRow } from './utils/sheetHelper.js';

async function testBackendIntegration() {
  try {
    console.log('🧪 Testing backend Google Sheets integration...');
    
    const testJob = {
      customerName: 'Backend Test Customer',
      mobileNumber: '9999999999',
      mobileModel: 'Test Phone Model',
      issue: 'Screen Replacement',
      customIssue: '',
      expectedDate: '2025-10-15',
      status: 'Pending',
      notes: 'Backend integration test'
    };
    
    const result = await appendRow(testJob);
    console.log('✅ Backend test successful:', result);
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testBackendIntegration();

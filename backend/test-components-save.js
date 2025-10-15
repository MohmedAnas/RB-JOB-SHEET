import { appendRow } from './utils/sheetHelper.js';

async function testComponentsSave() {
  try {
    console.log('🧪 Testing Components save...');
    
    const testJob = {
      customerName: 'Test Components User',
      mobileNumber: '1111111111',
      mobileModel: 'Test Phone',
      issue: 'Display Problem',
      components: 'Display changed, Battery replaced, Speaker fixed',
      expectedDate: '2025-10-15',
      status: 'In Progress',
      totalAmount: '3000',
      entryDate: new Date().toISOString().split('T')[0]
    };
    
    console.log('📝 Test job data:', testJob);
    console.log('🔍 Components field:', testJob.components);
    
    const result = await appendRow(testJob);
    console.log('✅ Job created with UID:', result.uid);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testComponentsSave();

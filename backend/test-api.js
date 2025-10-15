import { getSheetData } from './utils/sheetHelper.js';

async function testAPI() {
  try {
    console.log('🧪 Testing getSheetData API...');
    const jobs = await getSheetData();
    console.log('Jobs found:', jobs.length);
    console.log('Sample job data:', jobs[0]);
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();

import { getSheet } from './config/googleSheet.js';

async function debugColumns() {
  try {
    console.log('🔍 Debugging Google Sheets columns...');
    
    const sheet = await getSheet();
    await sheet.loadHeaderRow();
    
    console.log('📋 Current headers in order:');
    sheet.headerValues.forEach((header, index) => {
      console.log(`${index + 1}. "${header}"`);
    });
    
    console.log('\n📝 Expected order:');
    const expected = [
      'Job Sheet ID',
      'Customer', 
      'Mobile Number',
      'Mobile Model',
      'Issue Description',
      'Components',
      'Status',
      'Entry Date',
      'Completed Date',
      'Total Amount',
      'Comments'
    ];
    
    expected.forEach((header, index) => {
      console.log(`${index + 1}. "${header}"`);
    });
    
    console.log('\n🔍 Checking for mismatches:');
    expected.forEach((expectedHeader, index) => {
      const actualHeader = sheet.headerValues[index];
      if (actualHeader !== expectedHeader) {
        console.log(`❌ Position ${index + 1}: Expected "${expectedHeader}", Got "${actualHeader}"`);
      } else {
        console.log(`✅ Position ${index + 1}: "${expectedHeader}" matches`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugColumns();

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
const sheetId = process.env.GOOGLE_SHEET_ID;

async function testGoogleSheets() {
  try {
    console.log('🔧 Testing Google Sheets Connection...');
    console.log('Sheet ID:', sheetId);
    console.log('Service Account:', email);
    
    const serviceAccountAuth = new JWT({
      email: email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    
    await doc.loadInfo();
    console.log('✅ Document loaded:', doc.title);
    
    // List all sheets
    console.log('\n📋 Available sheets:');
    doc.sheetsByIndex.forEach((sheet, index) => {
      console.log(`  ${index}: "${sheet.title}" (${sheet.rowCount} rows, ${sheet.columnCount} cols)`);
    });
    
    // Try to find RB-JOB-SHEET
    const targetSheet = doc.sheetsByTitle['RB-JOB-SHEET'];
    if (targetSheet) {
      console.log('\n✅ Found target sheet: RB-JOB-SHEET');
      console.log('Rows:', targetSheet.rowCount);
      console.log('Columns:', targetSheet.columnCount);
      
      // Load header row
      await targetSheet.loadHeaderRow();
      console.log('Headers:', targetSheet.headerValues);
      
      // Get existing rows
      const rows = await targetSheet.getRows();
      console.log('Existing data rows:', rows.length);
      
      // Test adding a row
      console.log('\n🧪 Testing row addition...');
      const testData = {
        uid: 'TEST001',
        customerName: 'Test Customer',
        mobileNumber: '1234567890',
        mobileModel: 'Test Phone',
        issue: 'Test Issue',
        customIssue: '',
        entryDate: new Date().toISOString().split('T')[0],
        expectedDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        completionDate: '',
        notes: 'Test entry'
      };
      
      const newRow = await targetSheet.addRow(testData);
      console.log('✅ Test row added successfully');
      console.log('New row data:', {
        uid: newRow.get('uid'),
        customerName: newRow.get('customerName'),
        status: newRow.get('status')
      });
      
      // Clean up test row
      await newRow.delete();
      console.log('🧹 Test row cleaned up');
      
    } else {
      console.log('❌ Sheet "RB-JOB-SHEET" not found!');
      console.log('Available sheets:', Object.keys(doc.sheetsByTitle));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGoogleSheets();

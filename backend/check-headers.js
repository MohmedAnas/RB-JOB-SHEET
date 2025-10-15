import { getSheet } from './config/googleSheet.js';

async function checkHeaders() {
  try {
    const sheet = await getSheet();
    await sheet.loadHeaderRow();
    console.log('Exact headers in sheet:');
    sheet.headerValues.forEach((header, index) => {
      console.log(`${index}: "${header}"`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkHeaders();

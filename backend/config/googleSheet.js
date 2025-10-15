import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
const sheetId = process.env.GOOGLE_SHEET_ID;

let sheet = null;
let adminSheet = null;

export async function initializeSheet() {
  try {
    const serviceAccountAuth = new JWT({
      email: email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();
    
    // Use the "Sheet1" tab
    sheet = doc.sheetsByTitle['Sheet1'];
    if (!sheet) {
      throw new Error('Tab "Sheet1" not found');
    }
    
    // Use the "Sheet2" tab for admin credentials
    adminSheet = doc.sheetsByTitle['Sheet2'];
    if (!adminSheet) {
      throw new Error('Tab "Sheet2" not found');
    }
    
    
  } catch (error) {
    throw error;
  }
}

export async function getSheet() {
  if (!sheet) {
    await initializeSheet();
  }
  return sheet;
}

export async function getAdminSheet() {
  if (!adminSheet) {
    await initializeSheet();
  }
  return adminSheet;
}

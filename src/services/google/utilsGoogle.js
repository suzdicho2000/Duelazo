import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const sheetPackages = process.env.PACKAGES;
// const sheetTransactions = process.env.TRANSACTIONS;

// const auth = new google.auth.GoogleAuth({
//   keyFile: './google.json',
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });
const credentials = JSON.parse(process.env.GOOGLE_KEY);
const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key.replace(/\\n/g, '\n'), [
  'https://www.googleapis.com/auth/spreadsheets',
]);

const spreadsheetId = process.env.ID_GOOGLE_SHEET;

export async function dataCell(rango) {
  const sheets = google.sheets({ version: 'v4', auth });
  const resMesasTotal = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: rango,
  });
  const rows = resMesasTotal.data.values;
  return rows;
}

export async function readPackages() {
  const rangoTotal = `${sheetPackages}!A2:C100`;
  try {
    const rows = await dataCell(rangoTotal);
    return rows;
  } catch (error) {
    console.error('error', error);
  }
}

export async function findCell(arraydata, value, valMesa) {
  if (arraydata && arraydata.length > 0) {
    for (let i = 0; i < arraydata.length; i++) {
      if (arraydata[i][0] === value.toString()) {
        if (valMesa == true) {
          const cellAddress = [`${sheetPackages}!B${i + 2}`, `${sheetPackages}!C${i + 2}`];

          return cellAddress;
        }
        const cellAddress = `${sheetPackages}!A${i + 2}:F${i + 2}`;
        return cellAddress;
      }
    }
  }
  return false;
}

export async function createTransaction(data, rango) {
  const sheets = google.sheets({ version: 'v4', auth });
  const valueInputOption = 'USER_ENTERED';
  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: rango,
      valueInputOption,
      resource: data,
    });
    return true;
  } catch (error) {
    console.error('error', error);
  }
}

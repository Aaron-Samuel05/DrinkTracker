const SPREADSHEET_ID = '1CSvo-3ttQ5Rp7mr4jdFL2c36xq83uqSqBJoMtevZ1zI';
const SHEET_NAME = ''; // Leave blank to use the first tab.

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
  if (!sheet) throw new Error('Could not find the target sheet tab.');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Employee', 'Drink', 'Entry ID']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const employee = String(body.employee || '').trim().slice(0, 100);
    const drink = String(body.drink || '').trim();
    const id = String(body.id || Utilities.getUuid()).slice(0, 100);
    if (!employee) return json_({ ok: false, error: 'Employee name is required.' });
    if (!['Coffee', 'Tea', 'Milk'].includes(drink)) return json_({ ok: false, error: 'Invalid drink.' });
    const sheet = getSheet_();
    sheet.appendRow([new Date(), employee, drink, id]);
    return json_({ ok: true, id: id });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// JSONP read endpoint so the static website can load shared records cross-origin.
function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || '');
  try {
    const sheet = getSheet_();
    const values = sheet.getDataRange().getValues();
    const rows = values.slice(1).map(function (row) {
      return {
        at: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
        employee: String(row[1] || ''),
        drink: String(row[2] || ''),
        id: String(row[3] || '')
      };
    }).filter(function (r) { return r.employee && ['Coffee', 'Tea', 'Milk'].includes(r.drink); });
    const payload = JSON.stringify({ ok: true, records: rows });
    if (callback && /^[a-zA-Z_$][0-9a-zA-Z_$\.]*$/.test(callback)) {
      return ContentService.createTextOutput(callback + '(' + payload + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    const payload = JSON.stringify({ ok: false, error: String(err), records: [] });
    if (callback && /^[a-zA-Z_$][0-9a-zA-Z_$\.]*$/.test(callback)) {
      return ContentService.createTextOutput(callback + '(' + payload + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
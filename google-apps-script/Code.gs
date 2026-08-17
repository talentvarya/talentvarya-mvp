/**
 * TalentVarya Google Sheets webhook.
 * In Apps Script Project Settings, add Script Property:
 * TALENTVARYA_WEBHOOK_SECRET = the same value as GOOGLE_APPS_SCRIPT_SECRET.
 */
function doPost(event) {
  try {
    var body = JSON.parse((event && event.postData && event.postData.contents) || '{}');
    var expectedSecret = PropertiesService.getScriptProperties().getProperty('TALENTVARYA_WEBHOOK_SECRET');
    if (!expectedSecret || body.secret !== expectedSecret) {
      return jsonResponse_({ ok: false, error: 'Unauthorized' });
    }

    var allowedSheets = [
      'Users', 'Jobs', 'Applications', 'Resume_Views', 'Documents',
      'Email_Verification', 'Banners', 'Subscriptions', 'Payments', 'Audit_Log'
    ];
    if (allowedSheets.indexOf(body.sheet) === -1 || !body.row) {
      return jsonResponse_({ ok: false, error: 'Invalid sheet or row' });
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(body.sheet);
    if (!sheet) return jsonResponse_({ ok: false, error: 'Sheet not found: ' + body.sheet });

    var lastColumn = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
    var values = headers.map(function(header) {
      var key = normalizeKey_(header);
      return Object.prototype.hasOwnProperty.call(body.row, key) ? body.row[key] : '';
    });
    sheet.appendRow(values);
    return jsonResponse_({ ok: true, sheet: body.sheet, rowNumber: sheet.getLastRow() });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error) });
  }
}

function normalizeKey_(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function jsonResponse_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

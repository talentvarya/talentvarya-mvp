# TalentVarya Google Sheets connection

The included native Sheet is the MVP data workbook. The local API keeps SQLite as a safe development fallback and can mirror new records to Google Sheets.

1. Open the `TalentVarya Database` Google Sheet.
2. Choose **Extensions → Apps Script**.
3. Replace the editor contents with `google-apps-script/Code.gs`.
4. In **Project Settings → Script properties**, add `TALENTVARYA_WEBHOOK_SECRET` with a long random value.
5. Choose **Deploy → New deployment → Web app**. Execute as yourself and allow access only to the accounts appropriate for your setup.
6. Copy the deployment `/exec` URL into `.env` as `GOOGLE_APPS_SCRIPT_URL`.
7. Put the same random value in `.env` as `GOOGLE_APPS_SCRIPT_SECRET`.
8. Restart `npm run dev`.

Never put the webhook secret in frontend code. The Express API sends it server-to-server. The Admin Centre remains protected by `TV_ADMIN_EMAILS` and `TV_ADMIN_ACCESS_CODE`.

# Daily Pour — The Bot Company

A mobile-friendly beverage logging app for Coffee, Tea, and Milk.

## Features
- First-use employee name setup, remembered in that browser
- One-tap coffee, tea, or milk logging
- Automatic timestamps
- Today's per-employee and overall counts
- Recent activity, record undo, and CSV export
- Responsive phone and desktop UI

## Run
This repository is a static single-page app. Open `index.html` or deploy the repository as a static site on Vercel.

## Important: shared data
The current implementation uses browser `localStorage`. That means records only exist in the browser/device where each tap was logged. It is a UI/functional starter and is **not yet suitable for company-wide shared reporting**.

For the production workflow, connect a cloud database such as Supabase:
1. Employees open the same hosted link and register/select their name once.
2. Each tap inserts a record into a shared database with employee ID, drink type, and timestamp.
3. The admin dashboard reads aggregated counts and records from the database.
4. Restrict admin reports and record corrections to authorized admins. Name-only selection is not secure authentication.

Do not store private admin keys in frontend JavaScript. Use row-level security and server-side authorization before using real employee data.


## Connect the supplied Google Sheet

Spreadsheet: https://docs.google.com/spreadsheets/d/1CSvo-3ttQ5Rp7mr4jdFL2c36xq83uqSqBJoMtevZ1zI/edit

1. Open https://script.google.com/ while signed into the Google account that can edit the spreadsheet.
2. Create a new Apps Script project.
3. Replace the editor contents with the code in [google-apps-script/Code.gs](google-apps-script/Code.gs) (open that file in this repository and copy its contents).
4. Save the project. Run no function manually; the web app will create the header row on its first request if the sheet is empty.
5. Click **Deploy → New deployment**. Choose **Web app**.
6. Set **Execute as** to **Me**. Set access to **Anyone** if that option is permitted by your organization's Google Workspace policy. This makes the endpoint public; do not use it for sensitive information, and consider adding abuse protection before production.
7. Click **Deploy**, authorize the requested permissions, then copy the Web app URL ending in `/exec`.
8. In `index.html`, replace `PASTE_YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE` in `GOOGLE_SCRIPT_URL` with that URL, commit the change, and redeploy the Vercel project.
9. Test one drink and confirm a new row appears in the spreadsheet. The script uses the first tab by default; set `SHEET_NAME` in Code.gs if you need a specific tab.

The website sync code sends drink entries to Apps Script and reads the shared log using JSONP. A successful browser request does not guarantee a row was saved, so verify the first test in Sheets. The public endpoint accepts names and drink types without authentication; for a company production system, use verified employee identities and restrict/admin-protect write access.

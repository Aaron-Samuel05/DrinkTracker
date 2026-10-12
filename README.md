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

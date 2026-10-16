# Google Apps Script Backend Deployment Guide

This backend powers the product API, logs inquiries into Google Sheets, and sends instant email notifications to your configurable email list.

---

## 🚀 Step-by-Step Deployment (Under 5 Minutes)

### 1. Open Google Sheets & Apps Script
1. Open your master Google Sheet (**`SambalKe_Store_Database`**).
2. Click **Extensions** in the top navigation bar $\rightarrow$ **Apps Script**.
3. A new tab will open with the Apps Script code editor.

### 2. Paste the Script Code
1. Erase any existing placeholder code in `Code.gs`.
2. Copy the entire contents of [`workflows/03_apps_script_backend/Code.gs`](file:///Users/nsarangi1/Desktop/software_developement/POC/websites/google_sambalke/workflows/03_apps_script_backend/Code.gs) and paste it into the editor.
3. Click the **Save** disk icon (or press `Cmd + S` / `Ctrl + S`).

### 3. Run the Auto-Initializer (One-Time Setup)
1. In the toolbar dropdown next to "Debug", select the function `initDatabase`.
2. Click **Run**.
3. Google will ask for **Authorization**:
   - Click *Review Permissions*.
   - Choose your Google Account.
   - Click *Advanced* (small grey link at bottom) $\rightarrow$ *Go to Untitled Project (unsafe)*.
   - Click *Allow*.
4. Switch back to your Google Sheet! You will see three tabs created:
   - `Products` (populated with initial Sambalpuri bags)
   - `Inquiries_Orders` (with header columns ready)
   - `Settings` (configured with `NOTIFICATION_EMAIL_LIST`)

### 4. Test Email Sending
1. In Apps Script, select the function `testSendEmailNotification` from the dropdown.
2. Click **Run**.
3. Check your Gmail inbox! You will receive a sample HTML email notification with customer inquiry details and a 1-click WhatsApp button.

### 5. Deploy as Web App
1. At the top right of the Apps Script editor, click **Deploy** $\rightarrow$ **New deployment**.
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**.
3. Configure the settings:
   - **Description**: `SambalKe Public API v1`
   - **Execute as**: **`Me (your email address)`**
   - **Who has access**: **`Anyone`** *(CRITICAL: This allows your Google Site storefront to load catalog data and submit customer order queries without requiring customers to log in!)*
4. Click **Deploy**.
5. Copy the **Web App URL**. It looks like:
   `https://script.google.com/macros/s/AKfycbx.../exec`
6. Keep this URL safe! You will paste it into [`05_google_site_storefront/google_site_embed.html`](file:///Users/nsarangi1/Desktop/software_developement/POC/websites/google_sambalke/workflows/05_google_site_storefront/google_site_embed.html).

---

## ✉️ How to Modify Your Configured Email List
Whenever you want to add or change email addresses that receive order alerts:
1. Open your Google Sheet.
2. Go to the **`Settings`** tab.
3. Find the row with `NOTIFICATION_EMAIL_LIST`.
4. Enter comma-separated emails, e.g.:
   `owner@sambalke.com, partner@gmail.com, sales@sambalke.com`
5. That's it! **No redeployment needed**. The next customer inquiry will immediately dispatch to the updated list.

# Google Sheets Database Setup Guide

Google Sheets acts as the database for **SambalKe Handlooms**. It requires **zero maintenance**, **zero server costs**, and is easily editable on your laptop or phone.

---

## 🗂️ The Three Required Tabs

Create a single Google Spreadsheet named **`SambalKe_Store_Database`** and set up 3 tabs:

### Tab 1: `Products`
Stores all your live Sambalpuri merchandise.
- Refer to [`products_catalog_schema.csv`](file:///Users/nsarangi1/Desktop/software_developement/POC/websites/google_sambalke/workflows/01_google_sheets_setup/products_catalog_schema.csv) for sample rows.
- **Header Columns**:
  1. `Product_ID`: e.g. `SK-BAG-001`
  2. `Category`: e.g. `Bags`, `Sarees`, `Kurtas`, `Home Decor`
  3. `Title`: Product display name
  4. `Description`: Detailed artisan and weave description
  5. `Fabric_Type`: e.g. `100% Handloom Cotton`, `Pure Sambalpuri Silk`
  6. `Sizes_Available`: Comma-separated sizes, e.g. `Standard, Large` or `S, M, L, XL`
  7. `Price_INR`: Integer price in Rupees (₹) without currency signs (e.g. `1499`)
  8. `Image_URL`: Web link or Google Drive direct image URL
  9. `In_Stock`: `TRUE` or `FALSE` (if `FALSE`, product is hidden or marked Sold Out on Google Site)
  10. `Featured`: `TRUE` or `FALSE`

---

### Tab 2: `Inquiries_Orders`
Automatically populated when a customer submits an inquiry on your Google Site.
- Refer to [`inquiries_orders_schema.csv`](file:///Users/nsarangi1/Desktop/software_developement/POC/websites/google_sambalke/workflows/01_google_sheets_setup/inquiries_orders_schema.csv).
- **Header Columns**:
  1. `Inquiry_ID`: Generated automatically (e.g. `INQ-261016-1001`)
  2. `Timestamp`: Date and time of inquiry
  3. `Customer_Name`: Customer's full name
  4. `Mobile_Number`: Customer's phone number for calling / WhatsApp
  5. `Product_ID`: ID of requested item
  6. `Product_Title`: Name of requested item
  7. `Selected_Size`: Customer's chosen size
  8. `Quantity`: Number of units requested
  9. `Unit_Price_INR`: Unit price in ₹
  10. `Estimated_Total_INR`: Calculated total price in ₹
  11. `Delivery_Address_Pincode`: Shipping address or city/pincode
  12. `Customer_Notes`: Special requests or questions
  13. `Order_Status`: `New`, `Contacted`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`
  14. `Notification_Emails_Dispatched`: Log of which emails were notified
  15. `Notes_Internal`: Internal notes for your team

---

### Tab 3: `Settings`
Key-value configuration for the store.
- Refer to [`settings_schema.csv`](file:///Users/nsarangi1/Desktop/software_developement/POC/websites/google_sambalke/workflows/01_google_sheets_setup/settings_schema.csv).
- Key rows:
  - **`NOTIFICATION_EMAIL_LIST`**: Comma-separated emails to receive alerts (e.g. `owner@sambalke.com, partner@gmail.com`).
  - **`WHATSAPP_SUPPORT_NUMBER`**: International format without spaces (e.g. `919876543210`).
  - **`BRAND_NAME`**: e.g. `SambalKe Handlooms`.
  - **`CURRENCY_SYMBOL`**: `₹`.

> [!TIP]
> You can import the CSV files directly into Google Sheets by going to **File $\rightarrow$ Import $\rightarrow$ Upload** and choosing each CSV file into its respective tab.

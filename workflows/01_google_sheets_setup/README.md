# Google Sheets Database Setup Guide

Google Sheets acts as the database for **SambalKe Handlooms**. It requires **zero maintenance**, **zero server costs**, and is easily editable on your laptop or phone.

---

## 🗂️ The Database Tabs
Create a single Google Spreadsheet named **`SambalKe_Store_Database`** and set up the following tabs:

### Tab 1: `Categories`
Stores all product categories, subcategories, and category-specific sizes.
- Refer to [`categories_schema.csv`](file:///Users/nsarangi1/Desktop/software_developement/POC/websites/google_sambalke/workflows/01_google_sheets_setup/categories_schema.csv).
- **Header Columns**:
  1. `Category_ID`: Unique code (e.g. `CAT-HBO`, `CAT-OTH`, `CAT-SAR`, `CAT-APP`, `CAT-HOM`)
  2. `Category_Name`: Display name (e.g. `The Crescent Hobo`, `Sambalpuri Sarees`)
  3. `Icon`: Emoji icon (e.g. `🌙`, `🥻`, `👜`)
  4. `Subcategories`: Semicolon-separated subcategories (e.g. `Heritage Bandha;Passapalli Weave;Floral & Nature Ikat`)
  5. `Available_Sizes`: Semicolon-separated sizes defined for this category (e.g. `Standard (13.5 x 13.5 x 2.5 in);Small (12 x 12 in);Extra Large (15 x 15 in)`)
  6. `Description`: Description of the category
  7. `Status`: `ACTIVE` or `INACTIVE`

---

### Tab 2: `Products`
Stores all your live Sambalpuri merchandise.
- Refer to [`products_catalog_schema.csv`](file:///Users/nsarangi1/Desktop/software_developement/POC/websites/google_sambalke/workflows/01_google_sheets_setup/products_catalog_schema.csv) for sample rows.
- **Header Columns**:
  1. `Product_ID`: e.g. `SK-HBO-001`, `SK-OTH-001`
  2. `Category`: e.g. `The Crescent Hobo`, `In Other Bags`, `Sambalpuri Sarees`
  3. `Subcategory`: e.g. `Floral & Nature Ikat`, `Backpacks`
  4. `Title`: Product display name
  5. `Description`: Detailed artisan and weave description
  6. `Fabric_Type`: e.g. `100% Handloom Cotton`, `Pure Sambalpuri Silk`
  7. `Sizes_Available`: Category-defined dimensions/sizes
  8. `Price_INR`: Integer price in Rupees (₹) without currency signs (e.g. `1699`)
  9. `Image_URL`: Web link or image URL
  10. `In_Stock`: `TRUE` or `FALSE`

---

### Tab 3: `Inquiries_Orders`
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

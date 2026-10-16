# Admin Product Management via Google Form & Admin Portal

This component allows store managers and weavers to add or update Sambalpuri products without touching any spreadsheet formulas or code.

---

## 🛠️ Two Ways to Manage Products

You have two simple options provided in this workflow:
1. **Google Form (Standard Google Way)**: Use a free Google Form on your phone or PC.
2. **Web Admin Dashboard (Interactive Portal)**: Open [`admin_product_manager.html`](file:///Users/nsarangi1/Desktop/software_developement/POC/websites/google_sambalke/workflows/02_google_forms_admin/admin_product_manager.html) in your browser to view, search, and push new products directly into your catalog API.

---

## 🔐 Admin Password Security
The Admin Portal (`admin_product_manager.html`) and the Internal Tabs (`Costing Calculator` & `Inquiries Log` in `index.html`) are protected by a master password gate:
- **Default Password**: `sambalke@2026`
- **Configurable in Google Sheet**: Defined in `Settings` tab under `ADMIN_PASSWORD`.
- **Change Password**: You can change your password anytime directly from the Admin Portal using the **"🔑 Change Password"** modal.
- **Session Locking**: Click **"🔒 Lock & Logout"** on any admin page to immediately terminate the admin session and re-lock sensitive financial and customer order data.

---

## 📋 Google Form Setup (Step-by-Step)

### 1. Create a New Google Form
1. Go to [forms.new](https://forms.new).
2. Name the form: **`SambalKe - Product Catalog Manager`**.
3. Set description: *"Internal form to publish new bags, sarees, or handloom products to SambalKe Google Site."*

### 2. Configure Form Questions

| Question Title | Question Type | Options / Validation | Required? |
| :--- | :--- | :--- | :--- |
| **Category** | Dropdown | `Bags`<br/>`Sarees`<br/>`Kurtas & Apparel`<br/>`Dupattas & Shawls`<br/>`Home Decor & Furnishings` | Yes |
| **Product Title** | Short answer | Text (e.g. *Sambalpuri Double Ikat Classic Tote Bag*) | Yes |
| **Description** | Paragraph | Rich description detailing weave, motifs, zippers, lining, etc. | Yes |
| **Fabric Type** | Short answer | e.g. *100% Handloom Cotton*, *Pure Mulberry Silk* | Yes |
| **Available Sizes** | Checkboxes / Short answer | `Standard`, `Small`, `Large`, `XL`, `Free Size` | Yes |
| **Price in Rupees (₹)** | Short answer | Number $\ge 0$ (e.g. `1499`) | Yes |
| **Product Photo URL** | Short answer | Direct image URL (Unsplash, Cloudinary, Imgur, or Google Drive) | Yes |
| **In Stock?** | Multiple choice | `TRUE` (Available), `FALSE` (Sold out) | Yes |
| **Featured on Homepage?** | Multiple choice | `TRUE`, `FALSE` | No (Default FALSE) |

---

## 🔗 Linking Google Form to your Master Google Sheet

1. In the Google Form editor, click the **Responses** tab.
2. Click **Link to Sheets** (the green spreadsheet icon).
3. Select **"Select existing spreadsheet"** and choose your **`SambalKe_Store_Database`**.
4. This creates a tab called `Form Responses 1`.
5. Now, in Google Sheets, go to **Extensions $\rightarrow$ Apps Script** and paste [`FormToSheetSync.gs`](file:///Users/nsarangi1/Desktop/software_developement/POC/websites/google_sambalke/workflows/02_google_forms_admin/FormToSheetSync.gs).
6. Set an installable trigger for `onFormSubmit` (Trigger $\rightarrow$ Add Trigger $\rightarrow$ select `onFormSubmit` $\rightarrow$ From spreadsheet $\rightarrow$ On form submit).
7. Whenever anyone fills the Google Form, the product is automatically validated, assigned an ID like `SK-BAG-007`, and inserted directly into the live `Products` catalog sheet!

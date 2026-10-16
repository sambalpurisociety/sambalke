# Sambalpuri Product Expansion Blueprint

While the initial storefront launches with **Sambalpuri Handloom Bags**, the entire system architecture is built to expand effortlessly into other traditional Sambalpuri handloom categories without rewriting code.

---

## 🧭 Multi-Category Taxonomy

The table below outlines the standard product codes, sizing standards, and typical Indian Rupee (₹) pricing brackets for expanding your brand:

| Category | Product Code Prefix | Typical Products | Sizing Convention | Recommended INR (₹) Brackets |
| :--- | :--- | :--- | :--- | :--- |
| **Bags (Current)** | `SK-BAG-xxx` | Tote Bags, Sling Bags, Laptop Sleeves, Travel Duffels, Evening Clutches | `Standard`, `Small`, `Large`, `14-inch`, `15.6-inch` | ₹699 - ₹2,999 |
| **Sambalpuri Sarees** | `SK-SAR-xxx` | Pasapalli, Bomkai, Sachipar, Bapta, Cotton Bandha, Pure Mulberry Silk | `Free Size (6.3m with Blouse)` | ₹2,499 - ₹24,999 |
| **Kurtas & Apparel** | `SK-KRT-xxx` | Men's Short Kurtas, Long Kurtas, Women's Ikat Kurtis | `S (38)`, `M (40)`, `L (42)`, `XL (44)`, `XXL (46)` | ₹1,199 - ₹3,499 |
| **Dupattas & Shawls** | `SK-DUP-xxx` | Cotton Ikat Dupattas, Silk Stoles, Winter Woollen Bandha Shawls | `Free Size (2.5m)` | ₹799 - ₹4,499 |
| **Home & Furnishings** | `SK-HOM-xxx` | Ikat Cushion Covers, Dining Table Runners, Handwoven Bedcovers | `16x16 inch`, `18x18 inch`, `King Size` | ₹499 - ₹4,999 |

---

## 🛠️ How to Add a New Category (Zero Code Changes)

### Method 1: Via Admin Google Form
1. Open your **`SambalKe - Product Catalog Manager`** Google Form in edit mode.
2. In the **Category** dropdown question, add your new category option (e.g. `Kurtas & Apparel` or `Home & Furnishings`).
3. Fill out the form with a new product, size, and Rupee price.
4. The product will immediately appear in your Google Sheet and show up under the category filter on your Google Site!

### Method 2: Directly in Google Sheets
1. Open `SambalKe_Store_Database` $\rightarrow$ **`Products`** tab.
2. Add a new row:
   - `Product_ID`: `SK-SAR-002`
   - `Category`: `Sarees`
   - `Title`: *Sambalpuri Bomkai Silk Saree with Temple Border*
   - `Sizes_Available`: `Free Size (6.3m)`
   - `Price_INR`: `7999`
   - `Image_URL`: `https://...`
   - `In_Stock`: `TRUE`
3. Reload your Google Site—the new category and saree will be live!

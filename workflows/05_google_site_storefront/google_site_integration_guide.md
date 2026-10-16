# How to Embed the Storefront in Google Sites

This guide explains how to add the Sambalpuri Bag Storefront into your **Google Site** in under 3 minutes.

---

## 🛠️ Step-by-Step Embedding Instructions

### 1. Copy the Storefront HTML Code
1. Open [`workflows/05_google_site_storefront/google_site_embed.html`](file:///Users/nsarangi1/Desktop/software_developement/POC/websites/google_sambalke/workflows/05_google_site_storefront/google_site_embed.html).
2. At line 22, ensure you have set your deployed Apps Script URL:
   ```javascript
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   const STORE_WHATSAPP = "919876543210"; // Your WhatsApp number
   ```
3. Copy the entire HTML code.

### 2. Insert into Google Sites
1. Open your Google Site editor at [sites.google.com](https://sites.google.com).
2. On the right-hand sidebar, select the **Insert** tab.
3. Click the **Embed (< >)** icon.
4. In the pop-up modal, choose the **Embed code** tab.
5. Paste the copied HTML code into the box.
6. Click **Next** $\rightarrow$ **Insert**.

### 3. Layout & Dimension Adjustments
1. Google Sites will place the embed in an iframe block.
2. Click and drag the blue bounding box handles:
   - Drag the right handle all the way to make it full width.
   - Drag the bottom handle downward to give it sufficient height (e.g. 800px–1200px) so all bags display cleanly without internal scrolling.
3. Click **Preview** (computer/phone icon at top) to see how it looks on mobile and desktop devices.
4. Click **Publish** to make your Google Site store live to the world!

---

## 🌐 Alternative: Host on GitHub Pages or Vercel & Embed by URL
If you prefer embedding by URL rather than raw code:
1. Push this repository to GitHub or drag the folder to [vercel.com](https://vercel.com).
2. In Google Sites, choose **Embed (< >) $\rightarrow$ By URL**.
3. Paste the URL (e.g. `https://your-brand.vercel.app/google_site_embed.html`).
4. This allows you to update the code via git without having to re-paste code into Google Sites!

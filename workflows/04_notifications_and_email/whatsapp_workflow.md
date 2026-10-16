# Customer Query, Offline Payment & WhatsApp Notification Workflow

Since **SambalKe Handlooms does not process payments online**, this document outlines the exact workflow for capturing customer contact details, dispatching notifications, and concluding the sale offline.

---

## 🔄 End-to-End Inquiry Cycle

```
[Customer on Google Site]
      │
      ▼
1. Selects Sambalpuri Bag & Size (Price is hidden from public; displayed as "Price on Request")
      │
      ▼
2. Fills Inquiry Form (Customer Name, Email Address, Mobile Phone, City/Pincode, Notes)
      │
      ▼
3. Clicks "Submit Inquiry (Receive Price by Mail)"
      │
      ├──> A. Apps Script logs row to "Inquiries_Orders" in Google Sheet (with Admin Reference Price)
      │
      ├──> B. Apps Script emails all addresses in "NOTIFICATION_EMAIL_LIST" with 1-click "Email Price Quote" button
      │
      └──> C. Admin sends official price quotation (₹) directly to Customer's Email and/or WhatsApp
```

---

## 🔒 Pricing Policy: Hidden from Customer, Quoted via Email
- **Customer View**: Customers see authentic high-resolution images, weave specifications, and dimensions with the badge **"Price on Request (Sent via Email)"**. No prices are shown publicly.
- **Admin View**: Admins (after entering master password `sambalke@2026`) see all item catalog prices and costing margins in INR (₹) on the **Costing Calculator** and **Inquiries Log**.
- **Email Quotation**: When an inquiry arrives, the admin receives an alert email with customer details and a 1-click button to reply to the customer's email with the exact price quote in Rupees.

---

## 📲 How Offline Payment is Handled

Because customers **cannot pay online** directly on Google Sites:

1. **Clear Customer Expectations**:
   - The Google Site storefront explicitly displays:
     > *"No online payment required. Submit your contact details to reserve this authentic handcrafted piece. Our team will verify fabric availability and contact you via WhatsApp / Call."*

2. **Automated WhatsApp Deep Link**:
   - As soon as the customer submits their query, they receive a reference number (`INQ-YYMMDD-XXXX`) and an option to immediately chat with you on WhatsApp:
     ```
     https://wa.me/919876543210?text=Hello%20SambalKe,%20I%20just%20submitted%20order%20INQ-261016-1002%20for%20Sambalpuri%20Bandha%20Crossbody%20Sling%20Bag...
     ```

3. **Payment Collection Methods**:
   When following up with the customer via phone or WhatsApp, provide your preferred offline payment method:
   - **UPI / QR Code**: (Google Pay, PhonePe, Paytm, BHIM)
   - **Direct Bank Transfer / NEFT / IMPS**: Provide Account Number & IFSC
   - **Cash on Delivery (COD)**: If supported by your courier partner (e.g. India Post Speed Post, Shiprocket, Delhivery).

---

## ⚙️ How to Update Your Email Notification List

To add, remove, or modify who receives instant email alerts:
1. Open your Google Sheet (`SambalKe_Store_Database`).
2. Go to the **`Settings`** tab.
3. Edit the value for **`NOTIFICATION_EMAIL_LIST`**:
   ```
   owner@sambalke.com, orders@sambalke.com, partner@gmail.com
   ```
4. Changes take effect instantly for all future inquiries.

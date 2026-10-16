# Customer Query, Offline Payment & WhatsApp Notification Workflow

Since **SambalKe Handlooms does not process payments online**, this document outlines the exact workflow for capturing customer contact details, dispatching notifications, and concluding the sale offline.

---

## 🔄 End-to-End Inquiry Cycle

```
[Customer on Google Site]
      │
      ▼
1. Selects Sambalpuri Bag & Size (Price in ₹)
      │
      ▼
2. Fills Contact Form (Mobile Phone, Name, City/Pincode, Notes)
      │
      ▼
3. Clicks "Submit Inquiry"
      │
      ├──> A. Apps Script logs row to "Inquiries_Orders" in Google Sheet
      │
      ├──> B. Apps Script emails all addresses in "NOTIFICATION_EMAIL_LIST"
      │
      └──> C. Frontend prompts customer with instant "Chat on WhatsApp" button
```

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

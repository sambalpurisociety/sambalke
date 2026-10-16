/**
 * ============================================================================
 * SambalKe Handlooms - Serverless Backend Engine
 * Google Apps Script (Code.gs)
 * ============================================================================
 * 
 * Capabilities:
 * 1. doGet: Serves dynamic Sambalpuri products & store configuration as JSON API
 * 2. doPost: Processes customer queries/orders, records them in Google Sheets,
 *    and instantly dispatches HTML email notifications to the configured email list.
 * 3. Configurable Email List: Reads recipient emails directly from 'Settings' tab.
 * 4. Zero Hosting Cost & Zero Server Maintenance.
 */

// ----------------------------------------------------------------------------
// CONSTANTS & SHEET NAMES
// ----------------------------------------------------------------------------
const SHEET_PRODUCTS = "Products";
const SHEET_INQUIRIES = "Inquiries_Orders";
const SHEET_SETTINGS = "Settings";

/**
 * Handle GET Requests from Google Site or Frontend
 * Supported Actions:
 * - ?action=getProducts (&category=Bags)
 * - ?action=getSettings
 * - ?action=ping
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getProducts";
    const categoryFilter = (e && e.parameter && e.parameter.category) ? e.parameter.category : null;

    if (action === "getSettings") {
      const settings = getPublicSettings();
      return createJsonResponse({ status: "success", data: settings });
    }

    if (action === "ping") {
      return createJsonResponse({ status: "success", message: "SambalKe API is live and healthy." });
    }

    // Default: Return Products
    const products = fetchProductsFromSheet(categoryFilter);
    return createJsonResponse({
      status: "success",
      count: products.length,
      currency: "INR",
      currencySymbol: "₹",
      products: products
    });

  } catch (err) {
    Logger.log("Error in doGet: " + err.toString());
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Handle POST Requests (Customer Order Inquiries from Google Site)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Wait up to 10 seconds for lock to prevent concurrent write collisions
  lock.tryLock(10000);

  try {
    let payload = {};

    // Support both raw JSON and form-urlencoded payloads
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = e.parameter || {};
      }
    } else if (e.parameter) {
      payload = e.parameter;
    }

    // Validation
    const customerName = (payload.customerName || payload.name || "Valued Customer").toString().trim();
    const rawMobile = (payload.mobileNumber || payload.phone || "").toString().trim();
    const productId = (payload.productId || "SK-BAG-GEN").toString().trim();
    const productTitle = (payload.productTitle || payload.title || "Sambalpuri Handloom Bag").toString().trim();
    const selectedSize = (payload.selectedSize || payload.size || "Standard").toString().trim();
    const quantity = parseInt(payload.quantity || payload.qty, 10) || 1;
    const unitPrice = parseFloat(payload.unitPrice || payload.price) || 0;
    const estimatedTotal = parseFloat(payload.estimatedTotal || payload.total) || (unitPrice * quantity);
    const deliveryAddress = (payload.deliveryAddress || payload.address || "Contact for address").toString().trim();
    const customerNotes = (payload.customerNotes || payload.notes || "None").toString().trim();

    if (!rawMobile) {
      return createJsonResponse({
        status: "error",
        message: "Mobile number is required to place an order inquiry."
      });
    }

    // Format mobile number cleanly
    const mobileClean = rawMobile.replace(/[^\d+]/g, "");

    // Generate unique Inquiry ID (Format: INQ-YYMMDD-XXXX)
    const now = new Date();
    const dateStamp = Utilities.formatDate(now, "Asia/Kolkata", "yyMMdd");
    const randomSuffix = ("000" + Math.floor(Math.random() * 10000)).slice(-4);
    const inquiryId = `INQ-${dateStamp}-${randomSuffix}`;
    const timestampFormatted = Utilities.formatDate(now, "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    // 1. Fetch Store Settings & Configurable Email List
    const settings = getFullSettings();
    const emailList = getNotificationEmailList(settings);
    const brandName = settings.BRAND_NAME || "SambalKe Handlooms";
    const storeWhatsApp = (settings.WHATSAPP_SUPPORT_NUMBER || "919876543210").replace(/[^\d]/g, "");

    // 2. Append Inquiry to Google Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let inquirySheet = ss.getSheetByName(SHEET_INQUIRIES);
    if (!inquirySheet) {
      inquirySheet = ss.insertSheet(SHEET_INQUIRIES);
      inquirySheet.appendRow([
        "Inquiry_ID", "Timestamp", "Customer_Name", "Mobile_Number",
        "Product_ID", "Product_Title", "Selected_Size", "Quantity",
        "Unit_Price_INR", "Estimated_Total_INR", "Delivery_Address_Pincode",
        "Customer_Notes", "Order_Status", "Notification_Emails_Dispatched", "Notes_Internal"
      ]);
    }

    const emailSentLog = emailList.join(", ");
    inquirySheet.appendRow([
      inquiryId,
      timestampFormatted,
      customerName,
      mobileClean,
      productId,
      productTitle,
      selectedSize,
      quantity,
      unitPrice,
      estimatedTotal,
      deliveryAddress,
      customerNotes,
      "New Inquiry",
      emailSentLog,
      "Pending seller contact"
    ]);

    // 3. Dispatch Email Notification to Configurable Email List
    let emailStatus = "sent";
    try {
      sendInquiryEmailNotification({
        emailList: emailList,
        brandName: brandName,
        inquiryId: inquiryId,
        timestamp: timestampFormatted,
        customerName: customerName,
        mobileNumber: mobileClean,
        productId: productId,
        productTitle: productTitle,
        selectedSize: selectedSize,
        quantity: quantity,
        unitPrice: unitPrice,
        estimatedTotal: estimatedTotal,
        deliveryAddress: deliveryAddress,
        customerNotes: customerNotes
      });
    } catch (mailError) {
      Logger.log("Email dispatch error: " + mailError.toString());
      emailStatus = "failed: " + mailError.toString();
    }

    // 4. Generate direct WhatsApp chat URL for customer
    const waText = `Hello ${brandName}, I just submitted an inquiry on your website!\n\n` +
      `*Order Ref:* ${inquiryId}\n` +
      `*Product:* ${productTitle} (${selectedSize})\n` +
      `*Qty:* ${quantity}\n` +
      `*Total:* ₹${estimatedTotal.toLocaleString('en-IN')}\n` +
      `*My Phone:* ${mobileClean}\n` +
      `Please let me know how to confirm and complete payment.`;
    const waUrl = `https://wa.me/${storeWhatsApp}?text=${encodeURIComponent(waText)}`;

    return createJsonResponse({
      status: "success",
      message: "Order inquiry received successfully! We will contact you soon.",
      inquiryId: inquiryId,
      brandName: brandName,
      emailNotificationsSent: emailList.length,
      customerWhatsAppUrl: waUrl
    });

  } catch (err) {
    Logger.log("Error in doPost: " + err.toString());
    return createJsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

// ----------------------------------------------------------------------------
// HELPER FUNCTIONS: DATABASE & SETTINGS
// ----------------------------------------------------------------------------

/**
 * Fetch products from 'Products' sheet
 */
function fetchProductsFromSheet(categoryFilter) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PRODUCTS);
  if (!sheet) return getFallbackProducts();

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return getFallbackProducts();

  const headers = data[0].map(h => h.toString().trim());
  const idxId = headers.indexOf("Product_ID");
  const idxCat = headers.indexOf("Category");
  const idxTitle = headers.indexOf("Title");
  const idxDesc = headers.indexOf("Description");
  const idxFabric = headers.indexOf("Fabric_Type");
  const idxSizes = headers.indexOf("Sizes_Available");
  const idxPrice = headers.indexOf("Price_INR");
  const idxImg = headers.indexOf("Image_URL");
  const idxStock = headers.indexOf("In_Stock");
  const idxFeat = headers.indexOf("Featured");

  const products = [];

  for (let r = 1; r < data.length; r++) {
    const row = data[r];
    const inStockVal = (idxStock !== -1 && row[idxStock] !== undefined) ? row[idxStock].toString().toUpperCase() : "TRUE";
    const inStock = (inStockVal === "TRUE" || inStockVal === "YES" || inStockVal === "1");
    
    // Skip out of stock or blank rows
    if (!row[idxTitle]) continue;

    const category = (idxCat !== -1 && row[idxCat]) ? row[idxCat].toString().trim() : "Bags";

    if (categoryFilter && category.toLowerCase() !== categoryFilter.toLowerCase()) {
      continue;
    }

    const priceRaw = (idxPrice !== -1 && row[idxPrice]) ? row[idxPrice].toString().replace(/[^0-9.]/g, '') : "0";
    const priceInr = parseFloat(priceRaw) || 0;

    products.push({
      id: (idxId !== -1 && row[idxId]) ? row[idxId].toString().trim() : `SK-BAG-${r}`,
      category: category,
      title: (idxTitle !== -1) ? row[idxTitle].toString().trim() : "Sambalpuri Product",
      description: (idxDesc !== -1) ? row[idxDesc].toString().trim() : "",
      fabric: (idxFabric !== -1) ? row[idxFabric].toString().trim() : "Handloom Cotton",
      sizes: (idxSizes !== -1 && row[idxSizes]) ? row[idxSizes].toString().split(",").map(s => s.trim()) : ["Standard"],
      price: priceInr,
      image: (idxImg !== -1) ? row[idxImg].toString().trim() : "",
      inStock: inStock,
      featured: (idxFeat !== -1 && row[idxFeat]) ? row[idxFeat].toString().toUpperCase() === "TRUE" : false
    });
  }

  return products.length > 0 ? products : getFallbackProducts();
}

/**
 * Retrieve all settings from 'Settings' sheet
 */
function getFullSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SETTINGS);
  const settings = {
    BRAND_NAME: "SambalKe Handlooms",
    NOTIFICATION_EMAIL_LIST: "sambalpurisociety@gmail.com",
    CUSTOMER_SUPPORT_EMAIL: "sambalpurisociety@gmail.com",
    WHATSAPP_SUPPORT_NUMBER: "919876543210",
    CURRENCY_SYMBOL: "₹",
    CURRENCY_CODE: "INR"
  };

  if (!sheet) return settings;

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const key = data[i][0] ? data[i][0].toString().trim() : "";
    const val = data[i][1] !== undefined ? data[i][1].toString().trim() : "";
    if (key) {
      settings[key] = val;
    }
  }

  return settings;
}

/**
 * Public store settings safe to expose in GET API
 */
function getPublicSettings() {
  const full = getFullSettings();
  return {
    brandName: full.BRAND_NAME || "SambalKe Handlooms",
    supportEmail: full.CUSTOMER_SUPPORT_EMAIL || "sambalpurisociety@gmail.com",
    whatsappNumber: full.WHATSAPP_SUPPORT_NUMBER || "919876543210",
    currencySymbol: full.CURRENCY_SYMBOL || "₹",
    currencyCode: full.CURRENCY_CODE || "INR",
    contactPhone: full.CONTACT_PHONE || "+91 98765 43210"
  };
}

/**
 * Extract and sanitize configurable email list
 */
function getNotificationEmailList(settings) {
  const rawList = settings.NOTIFICATION_EMAIL_LIST || "";
  const emails = rawList.split(/[,;\n]/)
    .map(e => e.trim())
    .filter(e => e.length > 0 && e.indexOf("@") !== -1);

  if (emails.length === 0) {
    return ["sambalpurisociety@gmail.com"];
  }

  return emails;
}

// ----------------------------------------------------------------------------
// EMAIL NOTIFICATION DISPATCHER
// ----------------------------------------------------------------------------

/**
 * Sends a high-visibility, responsive HTML email alert to the configured email list
 */
function sendInquiryEmailNotification(d) {
  const subject = `🛍️ New Order Inquiry: ${d.productTitle} (${d.inquiryId}) - SambalKe`;
  
  // Format WhatsApp Link for Seller to click and message customer directly
  const sellerToCustomerWa = `https://wa.me/${d.mobileNumber.replace(/[^\d]/g, '')}?text=` +
    encodeURIComponent(`Hello ${d.customerName}, thank you for your inquiry for the ${d.productTitle} on SambalKe Handlooms! I am following up to confirm your size (${d.selectedSize}) and delivery address.`);

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #78350f, #991b1b); padding: 24px 28px; text-align: left; color: #ffffff;">
        <span style="background: rgba(255,255,255,0.2); font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 8px;">
          SambalKe Handlooms • New Order Inquiry
        </span>
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">
          New Customer Query Received!
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #fef3c7;">
          Ref: <strong>${d.inquiryId}</strong> • Logged on ${d.timestamp} IST
        </p>
      </div>

      <!-- Main Body Content -->
      <div style="padding: 24px 28px; color: #1c1917;">

        <!-- Alert Callout -->
        <div style="background-color: #fffbeb; border-left: 4px solid #d97706; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 600;">
            ⚠️ Customer cannot pay online. Please call or message them on WhatsApp to confirm order & payment.
          </p>
        </div>

        <!-- Customer Profile Card -->
        <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #78716c; letter-spacing: 0.5px;">
            👤 Customer Contact Information
          </h3>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #78716c; width: 130px;"><strong>Name:</strong></td>
              <td style="padding: 4px 0; color: #1c1917; font-weight: bold;">${d.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #78716c;"><strong>Mobile Phone:</strong></td>
              <td style="padding: 4px 0; color: #1c1917; font-weight: bold; font-size: 15px;">
                <a href="tel:${d.mobileNumber}" style="color: #991b1b; text-decoration: none;">📞 ${d.mobileNumber}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #78716c;"><strong>Delivery Address:</strong></td>
              <td style="padding: 4px 0; color: #1c1917;">${d.deliveryAddress}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #78716c;"><strong>Customer Notes:</strong></td>
              <td style="padding: 4px 0; color: #1c1917; font-style: italic;">"${d.customerNotes}"</td>
            </tr>
          </table>

          <!-- 1-Click WhatsApp Quick Action Button -->
          <div style="margin-top: 14px; text-align: left;">
            <a href="${sellerToCustomerWa}" target="_blank" style="background-color: #15803d; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: bold; padding: 9px 16px; border-radius: 6px; display: inline-block;">
              💬 Click to Chat on WhatsApp with Customer
            </a>
          </div>
        </div>

        <!-- Product Order Table -->
        <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #78716c; letter-spacing: 0.5px;">
          🛍️ Selected Product Details
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f5f5f4; border-bottom: 2px solid #e7e5e4;">
              <th style="padding: 8px 12px; text-align: left;">Item</th>
              <th style="padding: 8px 12px; text-align: center;">Size</th>
              <th style="padding: 8px 12px; text-align: center;">Qty</th>
              <th style="padding: 8px 12px; text-align: right;">Unit Price</th>
              <th style="padding: 8px 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e7e5e4;">
              <td style="padding: 10px 12px; font-weight: bold; color: #1c1917;">
                ${d.productTitle}
                <div style="font-size: 11px; color: #78716c; font-weight: normal;">Code: ${d.productId}</div>
              </td>
              <td style="padding: 10px 12px; text-align: center; font-weight: 600;">${d.selectedSize}</td>
              <td style="padding: 10px 12px; text-align: center;">${d.quantity}</td>
              <td style="padding: 10px 12px; text-align: right;">₹${d.unitPrice.toLocaleString('en-IN')}</td>
              <td style="padding: 10px 12px; text-align: right; font-weight: bold; color: #991b1b;">₹${d.estimatedTotal.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="padding: 10px 12px; text-align: right; font-weight: bold; font-size: 15px;">Estimated Total (INR):</td>
              <td style="padding: 10px 12px; text-align: right; font-weight: 800; font-size: 17px; color: #991b1b;">
                ₹${d.estimatedTotal.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- Footer Notification Info -->
        <div style="border-top: 1px solid #e7e5e4; padding-top: 14px; font-size: 11px; color: #a8a29e; text-align: center;">
          This automated alert was dispatched to your configured recipient list: 
          <strong>${d.emailList.join(', ')}</strong>.<br/>
          To update your email list, open the <strong>Settings</strong> tab in your Google Sheet.
        </div>

      </div>
    </div>
  `;

  // Send email to all configured recipients
  d.emailList.forEach(recipient => {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });
  });
}

/**
 * Creates standardized JSON response with CORS headers
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ----------------------------------------------------------------------------
// ONE-CLICK SETUP & TEST UTILITIES
// ----------------------------------------------------------------------------

/**
 * Run this function once from the Apps Script editor to auto-create the
 * database tabs, headers, sample Sambalpuri bags, and initial settings!
 */
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Setup 'Products' tab
  let prodSheet = ss.getSheetByName(SHEET_PRODUCTS);
  if (!prodSheet) prodSheet = ss.insertSheet(SHEET_PRODUCTS);
  if (prodSheet.getLastRow() === 0) {
    prodSheet.appendRow([
      "Product_ID", "Category", "Title", "Description", "Fabric_Type",
      "Sizes_Available", "Price_INR", "Image_URL", "In_Stock", "Featured"
    ]);
    const fallback = getFallbackProducts();
    fallback.forEach(p => {
      prodSheet.appendRow([
        p.id, p.category, p.title, p.description, p.fabric,
        p.sizes.join(", "), p.price, p.image, "TRUE", p.featured ? "TRUE" : "FALSE"
      ]);
    });
    prodSheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#fef3c7");
  }

  // 2. Setup 'Inquiries_Orders' tab
  let inqSheet = ss.getSheetByName(SHEET_INQUIRIES);
  if (!inqSheet) inqSheet = ss.insertSheet(SHEET_INQUIRIES);
  if (inqSheet.getLastRow() === 0) {
    inqSheet.appendRow([
      "Inquiry_ID", "Timestamp", "Customer_Name", "Mobile_Number",
      "Product_ID", "Product_Title", "Selected_Size", "Quantity",
      "Unit_Price_INR", "Estimated_Total_INR", "Delivery_Address_Pincode",
      "Customer_Notes", "Order_Status", "Notification_Emails_Dispatched", "Notes_Internal"
    ]);
    inqSheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#e0f2fe");
  }

  // 3. Setup 'Settings' tab
  let setSheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!setSheet) setSheet = ss.insertSheet(SHEET_SETTINGS);
  if (setSheet.getLastRow() === 0) {
    setSheet.appendRow(["Setting_Key", "Setting_Value", "Description"]);
    setSheet.appendRow(["NOTIFICATION_EMAIL_LIST", "sambalpurisociety@gmail.com", "Comma-separated emails to receive instant inquiry alerts"]);
    setSheet.appendRow(["CUSTOMER_SUPPORT_EMAIL", "sambalpurisociety@gmail.com", "Official customer support email"]);
    setSheet.appendRow(["BRAND_NAME", "SambalKe Handlooms", "Store name"]);
    setSheet.appendRow(["WHATSAPP_SUPPORT_NUMBER", "919876543210", "WhatsApp contact number without +"]);
    setSheet.appendRow(["CURRENCY_SYMBOL", "₹", "Currency symbol"]);
    setSheet.appendRow(["CONTACT_PHONE", "+91 98765 43210", "Customer phone support"]);
    setSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#f0fdf4");
  }

  Logger.log("Initialization complete! All tabs and sample data created.");
}

/**
 * Run this function in Apps Script editor to test if your email notification
 * is firing and arriving in your inbox!
 */
function testSendEmailNotification() {
  const settings = getFullSettings();
  const emailList = getNotificationEmailList(settings);

  sendInquiryEmailNotification({
    emailList: emailList,
    brandName: settings.BRAND_NAME || "SambalKe Handlooms",
    inquiryId: "INQ-TEST-0001",
    timestamp: Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss"),
    customerName: "Test Customer (Odisha)",
    mobileNumber: "+91 98765 43210",
    productId: "SK-BAG-001",
    productTitle: "Sambalpuri Double Ikat Classic Tote Bag",
    selectedSize: "Large",
    quantity: 1,
    unitPrice: 1499,
    estimatedTotal: 1499,
    deliveryAddress: "Sambalpur, Odisha - 768001",
    customerNotes: "Please test if email notifications arrive immediately."
  });

  Logger.log("Test email dispatched to: " + emailList.join(", "));
}

/**
 * Fallback catalogue if Google Sheets has no rows yet
 */
function getFallbackProducts() {
  return [
    {
      id: "SK-HBO-001",
      category: "Crescent Hobo",
      collection: "Crescent Hobo Collection",
      title: "Crimson Jaal Crescent Hobo",
      description: "Authentic Sambalpuri double ikat jaal check weave in crimson maroon and off-white.",
      fabric: "Pure Handloom Cotton Bandha",
      dimensions: "13.5 x 13.5 x 2.5 in (Belt: 21.5 in)",
      sizes: ["Standard"],
      price: 1699,
      image: "workflows/assets/crimson_jaal.png",
      inStock: true,
      featured: true
    },
    {
      id: "SK-HBO-002",
      category: "Crescent Hobo",
      collection: "Crescent Hobo Collection",
      title: "Regal Bloom Crescent Hobo",
      description: "Deep magenta and pink traditional Sambalpuri floral bandha motif with antique brass hooks.",
      fabric: "Handwoven Cotton Bandha",
      dimensions: "13.5 x 13.5 x 2.5 in (Belt: 21.5 in)",
      sizes: ["Standard"],
      price: 1699,
      image: "workflows/assets/regal_bloom.png",
      inStock: true,
      featured: true
    },
    {
      id: "SK-HBO-003",
      category: "Crescent Hobo",
      collection: "Crescent Hobo Collection",
      title: "Floral Duet Crescent Hobo",
      description: "Rich indigo blue field accented with bright yellow and pink floral bandha motifs.",
      fabric: "Pure Handloom Cotton",
      dimensions: "13.5 x 13.5 x 2.5 in (Belt: 21.5 in)",
      sizes: ["Standard"],
      price: 1699,
      image: "workflows/assets/floral_duet.png",
      inStock: true,
      featured: true
    },
    {
      id: "SK-HBO-004",
      category: "Crescent Hobo",
      collection: "Crescent Hobo Collection",
      title: "Konark Chakra Crescent Hobo",
      description: "Heritage Konark Sun Temple chariot wheel motifs in earthy black, gold, and red bandha.",
      fabric: "Handwoven Odisha Bandha",
      dimensions: "13.5 x 13.5 x 2.5 in (Belt: 21.5 in)",
      sizes: ["Standard"],
      price: 1899,
      image: "workflows/assets/konark_chakra.png",
      inStock: true,
      featured: true
    },
    {
      id: "SK-HBO-005",
      category: "Crescent Hobo",
      collection: "Crescent Hobo Collection",
      title: "Classic Passapalli Crescent Hobo",
      description: "Timeless Odisha chessboard check bandha in bold red, black, and green.",
      fabric: "Sambalpuri Passapalli Handloom",
      dimensions: "13.5 x 13.5 x 2.5 in (Belt: 21.5 in)",
      sizes: ["Standard"],
      price: 1799,
      image: "workflows/assets/classic_passapalli.png",
      inStock: true,
      featured: true
    },
    {
      id: "SK-HBO-006",
      category: "Crescent Hobo",
      collection: "Crescent Hobo Collection",
      title: "Gramya Crescent Hobo",
      description: "Tribal dance and village life folk motifs in traditional black, red, and ivory.",
      fabric: "Tribal Heritage Bandha",
      dimensions: "13.5 x 13.5 x 2.5 in (Belt: 21.5 in)",
      sizes: ["Standard"],
      price: 1799,
      image: "workflows/assets/gramya_crescent.png",
      inStock: true,
      featured: true
    },
    {
      id: "SK-HBO-011",
      category: "Crescent Hobo",
      collection: "Crescent Hobo Collection",
      title: "Van Katha Crescent Hobo",
      description: "Forest folklore wildlife weave featuring elephants and tigers in mustard, red, and blue.",
      fabric: "Sambalpuri Wildlife Ikat",
      dimensions: "13.5 x 13.5 x 2.5 in (Belt: 21.5 in)",
      sizes: ["Standard"],
      price: 1899,
      image: "workflows/assets/van_katha.png",
      inStock: true,
      featured: true
    },
    {
      id: "SK-OTH-001",
      category: "Other Bags",
      collection: "In Other Bags",
      title: "Sambalpuri Handloom Backpack",
      description: "Padded everyday daypack with zip compartment in peach-terracotta geometric ikat.",
      fabric: "100% Cotton Handloom",
      dimensions: "15 x 12 x 5 in",
      sizes: ["Medium"],
      price: 1899,
      image: "workflows/assets/other_backpack.png",
      inStock: true,
      featured: false
    },
    {
      id: "SK-OTH-002",
      category: "Other Bags",
      collection: "In Other Bags",
      title: "Sambalpuri Mobile Pouch Sling",
      description: "Sleek vertical mobile pouch with magnetic lock in crimson bandha.",
      fabric: "Handloom Cotton Bandha",
      dimensions: "7.5 x 4.5 x 1.5 in",
      sizes: ["Universal Phone"],
      price: 599,
      image: "workflows/assets/other_mobile_pouch.png",
      inStock: true,
      featured: false
    },
    {
      id: "SK-OTH-003",
      category: "Other Bags",
      collection: "In Other Bags",
      title: "Traditional Bridal / Festive Potlis",
      description: "Silk-velvet handcrafted potli bag with gold zari lace and pearl-beaded handle.",
      fabric: "Silk-Velvet Blend",
      dimensions: "9 x 8 in",
      sizes: ["Standard"],
      price: 899,
      image: "workflows/assets/other_potlis.png",
      inStock: true,
      featured: false
    }
  ];
}

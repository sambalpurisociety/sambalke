/**
 * SambalKe Handlooms - FormToSheetSync.gs
 * 
 * Automatically synchronizes submissions from the Admin Google Form into
 * the live 'Products' database sheet, generating unique product IDs and
 * ensuring data formatting for the Google Sites storefront.
 */

function onFormSubmitSync(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productsSheet = ss.getSheetByName('Products');
  
  if (!productsSheet) {
    Logger.log("Error: 'Products' sheet not found.");
    return;
  }
  
  // Extract values from event or latest row of Form Responses
  const responseSheet = e ? e.range.getSheet() : ss.getSheetByName('Form Responses 1');
  const lastRow = responseSheet.getLastRow();
  const rowData = responseSheet.getRange(lastRow, 1, 1, responseSheet.getLastColumn()).getValues()[0];
  
  // Assuming standard form column order:
  // [0: Timestamp, 1: Category, 2: Title, 3: Description, 4: Fabric, 5: Sizes, 6: Price, 7: Image_URL, 8: In_Stock, 9: Featured]
  const category = (rowData[1] || 'Bags').toString().trim();
  const title = (rowData[2] || '').toString().trim();
  const description = (rowData[3] || '').toString().trim();
  const fabricType = (rowData[4] || '100% Handloom Cotton').toString().trim();
  const sizes = (rowData[5] || 'Standard').toString().trim();
  const rawPrice = (rowData[6] || '0').toString().replace(/[^0-9.]/g, '');
  const priceInr = parseFloat(rawPrice) || 0;
  const imageUrl = (rowData[7] || '').toString().trim();
  const inStock = (rowData[8] && rowData[8].toString().toUpperCase().indexOf('TRUE') !== -1) ? 'TRUE' : 'TRUE';
  const featured = (rowData[9] && rowData[9].toString().toUpperCase().indexOf('TRUE') !== -1) ? 'TRUE' : 'FALSE';
  
  if (!title) {
    Logger.log("Skipping sync: Empty product title.");
    return;
  }
  
  // Generate prefix based on category
  let prefix = 'SK-PRD';
  if (category.toLowerCase().indexOf('bag') !== -1) prefix = 'SK-BAG';
  else if (category.toLowerCase().indexOf('saree') !== -1) prefix = 'SK-SAR';
  else if (category.toLowerCase().indexOf('kurta') !== -1) prefix = 'SK-KRT';
  else if (category.toLowerCase().indexOf('dupatta') !== -1) prefix = 'SK-DUP';
  
  const existingCount = productsSheet.getLastRow();
  const nextNum = ('000' + existingCount).slice(-3);
  const productId = `${prefix}-${nextNum}`;
  
  // Append row to 'Products' sheet
  productsSheet.appendRow([
    productId,
    category,
    title,
    description,
    fabricType,
    sizes,
    priceInr,
    imageUrl,
    inStock,
    featured
  ]);
  
  Logger.log(`Successfully added product ${productId} - ${title} to live catalog.`);
}

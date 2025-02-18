export default async function handler(event, context) {
  // Accept both POST and GET requests
  if (event.httpMethod === 'POST' || event.httpMethod === 'GET') {
    // Log the incoming request for debugging.
    console.log("Payment OK Callback received. Raw body:", event.body);
    
    // Extract query parameters from the URL (CPAY may send parameters in the URL)
    const { orderId, orderNumber, appSectionParams } = event.queryStringParameters || {};
    
    // Build the final URL on your main site where you want to redirect the user.
    // For example, redirect to your thank-you page. Adjust as needed.
    let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId || "default"}`;
    if (orderNumber) {
      finalUrl += `?orderNumber=${

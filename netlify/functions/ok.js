exports.handler = async function(event, context) {
  try {
    // Log basic information (optional for production)
    console.log("Payment OK Callback - HTTP Method:", event.httpMethod);
    console.log("Payment OK Callback - Raw Body:", event.body);
    
    // Attempt to parse the request body (if sent by cPay)
    let parsedBody = {};
    try {
      parsedBody = event.body ? JSON.parse(event.body) : {};
    } catch(e) {
      console.log("Payment OK Callback - Body is not JSON, using raw text.");
    }
    
    // Extract query parameters
    const { orderId, orderNumber, appSectionParams } = event.queryStringParameters || {};
    
    // For our purpose, use orderId as the Wix order identifier.
    // And assume that cPay sends a reference in cPayPaymentRef in the POST body.
    const wixTransactionId = orderId || "default";
    const pluginTransactionId = parsedBody.cPayPaymentRef || "unknown";
    
    // Call the Wix HTTP function to update the transaction.
    // (Ensure that the Wix endpoint exists and correctly handles the data.)
    const wixResponse = await fetch("https://www.mnmlbynana.com/_functions/updateTransaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state: "Payment_Received",
        wixTransactionId: wixTransactionId,
        pluginTransactionId: pluginTransactionId
      })
    });
    console.log("Wix updateTransaction response status:", wixResponse.status);
    
    // Build the final thank-you page URL for browser redirection.
    let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId || "default"}`;
    if (orderNumber) {
      finalUrl += `?orderNumber=${orderNumber}`;
      if (appSectionParams) {
        finalUrl += `&appSectionParams=${appSectionParams}`;
      }
    }
    console.log("Payment OK Callback - Final URL:", finalUrl);
    
    // For browser (GET) requests, return an HTML page that redirects.
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta http-equiv="refresh" content="0; url=${finalUrl}" />
            <script>
              window.location.href = "${finalUrl}";
            </script>
            <title>Redirecting...</title>
            <style>body { display: none; }</style>
          </head>
          <body></body>
          </html>
        `
      };
    }
    
    // For POST (cPay push) requests, return a plain text response with HTTP 200 OK.
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: ""
    };
  } catch (err) {
    console.error("Error in Payment OK Callback:", err);
    return {
      statusCode: 500,
      body: "Internal Server Error"
    };
  }
};

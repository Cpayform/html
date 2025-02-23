exports.handler = async function(event, context) {
  try {
    // Extract query parameters (order details from the URL)
    const { orderId, orderNumber, appSectionParams } = event.queryStringParameters || {};
    let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId || "default"}`;
    if (orderNumber) {
      finalUrl += `?orderNumber=${orderNumber}`;
      if (appSectionParams) {
        finalUrl += `&appSectionParams=${appSectionParams}`;
      }
    }
    console.log("Final redirect URL:", finalUrl);
    
    // If the request is a POST (cPay push notification), call the Wix HTTP function
    if (event.httpMethod === 'POST') {
      let parsedData = {};
      try {
        parsedData = event.body ? JSON.parse(event.body) : {};
      } catch (e) {
        console.log("POST body is not JSON, proceeding without parsed data.");
      }
      
      // Prepare payload for Wix update (adjust keys as needed)
      const payload = {
        state: "Payment_Received",
        wixTransactionId: orderId || "default",
        pluginTransactionId: parsedData.cPayPaymentRef || "unknown"
      };
      console.log("Sending payload to Wix updateTransaction:", payload);
      
      // Call the Wix HTTP function endpoint to update the transaction in Wix
      const wixEndpoint = "https://www.mnmlbynana.com/_functions/updateTransaction";
      const wixResponse = await fetch(wixEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      console.log("Wix updateTransaction response status:", wixResponse.status);
      
      // Return a plain 200 OK for the push notification
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: ""
      };
    } else {
      // For GET requests (browser redirect), return the HTML redirect page.
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta http-equiv="refresh" content="0; url=${finalUrl}" />
            <script>window.location.href = "${finalUrl}";</script>
            <title>Redirecting...</title>
            <style>body { display: none; }</style>
          </head>
          <body></body>
          </html>
        `
      };
    }
  } catch (err) {
    console.error("Error in Payment OK Callback:", err);
    return {
      statusCode: 500,
      body: "Internal Server Error"
    };
  }
};

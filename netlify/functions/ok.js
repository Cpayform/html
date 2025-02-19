exports.handler = async function(event, context) {
  try {
    console.log("Payment OK Callback - HTTP Method:", event.httpMethod);
    console.log("Payment OK Callback - Raw Body:", event.body);
    try {
      const parsedData = event.body ? JSON.parse(event.body) : {};
      console.log("Payment OK Callback - Parsed Body:", parsedData);
    } catch (err) {
      console.log("Payment OK Callback - Body is not JSON, using raw text.");
    }
    
    // Extract query parameters from the URL
    const { orderId, orderNumber, appSectionParams } = event.queryStringParameters || {};
    let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId || "default"}`;
    if (orderNumber) {
      finalUrl += `?orderNumber=${orderNumber}`;
      if (appSectionParams) {
        finalUrl += `&appSectionParams=${appSectionParams}`;
      }
    }
    console.log("Payment OK Callback - Final URL:", finalUrl);
    
    if (event.httpMethod === 'POST') {
      // For push notifications, return 200 OK with empty body.
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: ""
      };
    } else {
      // For browser redirects (GET requests), return an HTML redirect page.
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
          </head>
          <body>
            <p>Payment successful. Redirecting...</p>
          </body>
          </html>
        `
      };
    }
  } catch (err) {
    console.error("Error in Payment OK Callback:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message })
    };
  }
};

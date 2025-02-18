// File: netlify/functions/ok.js

exports.handler = async function(event, context) {
  try {
    // Log the HTTP method and raw POST data sent by CPAY
    console.log("Payment OK Callback - HTTP Method:", event.httpMethod);
    console.log("Payment OK Callback - Raw Body:", event.body);

    // Optionally, if CPAY sends JSON data, you can try to parse it:
    let parsedData;
    try {
      parsedData = event.body ? JSON.parse(event.body) : {};
      console.log("Payment OK Callback - Parsed Body:", parsedData);
    } catch (err) {
      console.log("Payment OK Callback - Body is not JSON, using raw text.");
    }

    // Extract query parameters from the URL (if any)
    const { orderId, orderNumber, appSectionParams } = event.queryStringParameters || {};

    // Build the final URL to redirect the user on your main site.
    let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId || "default"}`;
    if (orderNumber) {
      finalUrl += `?orderNumber=${orderNumber}`;
      if (appSectionParams) {
        finalUrl += `&appSectionParams=${appSectionParams}`;
      }
    }
    console.log("Payment OK Callback - Redirecting to:", finalUrl);

    // Return an HTML page that auto-redirects the user
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
  } catch (err) {
    console.error("Error in Payment OK Callback:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message })
    };
  }
};

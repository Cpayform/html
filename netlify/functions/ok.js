// File: netlify/functions/ok.js

exports.handler = async function(event, context) {
  // Accept both GET and POST methods
  if (event.httpMethod === 'POST' || event.httpMethod === 'GET') {
    // Log the incoming request body for debugging
    console.log("Payment OK Callback received. Raw data:", event.body);
    
    // Extract query parameters (Netlify passes them in event.queryStringParameters)
    const { orderId, orderNumber, appSectionParams } = event.queryStringParameters || {};
    
    // Build the final URL to redirect the user on your main site
    let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId || "default"}`;
    if (orderNumber) {
      finalUrl += `?orderNumber=${orderNumber}`;
      if (appSectionParams) {
        finalUrl += `&appSectionParams=${appSectionParams}`;
      }
    }
    console.log("Redirecting to:", finalUrl);
    
    // Return an HTML response that auto-redirects the user
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
        </head>
        <body>
          <p>Payment successful. Redirecting...</p>
        </body>
        </html>
      `
    };
  } else {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }
};

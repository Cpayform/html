// File: netlify/functions/ok.js
exports.handler = async function(event, context) {
  try {
    // Log the entire raw request body (if any)
    console.log("Raw request body:", event.body);
    
    // Log the query parameters that were passed in the URL
    console.log("Query parameters:", event.queryStringParameters);

    // (Optional) If you expect JSON data in the POST body, you can parse it:
    // const parsedBody = event.body ? JSON.parse(event.body) : {};
    // console.log("Parsed request body:", parsedBody);

    // Continue with your normal logic...
    const { orderId, orderNumber, appSectionParams } = event.queryStringParameters || {};
    let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId || "default"}`;
    if (orderNumber) {
      finalUrl += `?orderNumber=${orderNumber}`;
      if (appSectionParams) {
        finalUrl += `&appSectionParams=${appSectionParams}`;
      }
    }
    console.log("Redirecting to:", finalUrl);
    
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
  } catch (err) {
    console.error("Error in OK function:", err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};

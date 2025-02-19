exports.handler = async function(event, context) {
  try {
    console.log("Payment Fail Callback - HTTP Method:", event.httpMethod);
    console.log("Payment Fail Callback - Raw Body:", event.body);
    try {
      const parsedData = event.body ? JSON.parse(event.body) : {};
      console.log("Payment Fail Callback - Parsed Body:", parsedData);
    } catch (err) {
      console.log("Payment Fail Callback - Body is not JSON, using raw text.");
    }
    
    const finalUrl = "https://www.mnmlbynana.com/payment-failed";
    console.log("Payment Fail Callback - Final URL:", finalUrl);
    
    if (event.httpMethod === 'POST') {
      // For push notifications, return 200 OK with an empty body.
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: ""
      };
    } else {
      // For browser redirects, return the HTML redirect page.
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
            <p>Payment failed. Redirecting...</p>
          </body>
          </html>
        `
      };
    }
  } catch (err) {
    console.error("Error in Payment Fail Callback:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message })
    };
  }
};

exports.handler = async function(event, context) {
  try {
    // Log the HTTP method and raw POST data sent by CPAY
    console.log("Payment Fail Callback - HTTP Method:", event.httpMethod);
    console.log("Payment Fail Callback - Raw Body:", event.body);

    // Attempt to parse the body as JSON for debugging, if possible
    try {
      const parsedData = event.body ? JSON.parse(event.body) : {};
      console.log("Payment Fail Callback - Parsed Body:", parsedData);
    } catch (err) {
      console.log("Payment Fail Callback - Body is not JSON, using raw text.");
    }
    
    // For a failed payment, define the final URL to redirect to
    const finalUrl = "https://www.mnmlbynana.com/payment-failed";
    console.log("Payment Fail Callback - Final URL:", finalUrl);

    // If the request is a POST, return a plain text response "OK"
    if (event.httpMethod === 'POST') {
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: "OK"
      };
    } else {
      // For browser (GET) requests, return the HTML redirect page
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

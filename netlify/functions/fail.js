// File: netlify/functions/fail.js
export default async function handler(event, context) {
  if (event.httpMethod === 'POST' || event.httpMethod === 'GET') {
    console.log("Payment Fail Callback received. Raw body:", event.body);
    
    // For failed payment, simply redirect to a static payment-failed page on your main site.
    const finalUrl = "https://www.mnmlbynana.com/payment-failed";
    console.log("Redirecting to:", finalUrl);
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html"
      },
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="refresh" content="0; url=${finalUrl}" />
          <script>window.location.href = "${finalUrl}";</script>
          <title>Redirecting...</title>
        </head>
        <body>
          <p>Payment failed. Redirecting...</p>
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
}

exports.handler = async function(event, context) {
  try {
    const finalUrl = "https://www.mnmlbynana.com/payment-failed";
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
          <style>body{display:none;}</style>
        </head>
        <body></body>
        </html>
      `
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Internal Server Error"
    };
  }
};

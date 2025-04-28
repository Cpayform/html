// File: netlify/functions/ok.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // 1) Pull both IDs from the query
  const {
    orderId,        // Wix order _id
    transactionId,  // Wix transaction ID
    orderNumber,
    objectType,
    origin
  } = event.queryStringParameters || {};

  if (!orderId || !transactionId) {
    return {
      statusCode: 302,
      headers:    { Location: 'https://www.mnmlbynana.com' }
    };
  }

  // 2) Call your Wix HTTP function to flip the order to “Paid”
  try {
    const wixFnUrl = `https://www.mnmlbynana.com/_functions/use_updateTransaction`
      + `?transactionId=${encodeURIComponent(transactionId)}`;
    const wixRes = await fetch(wixFnUrl);
    console.log('Called Wix HTTP function:', wixRes.status);
  } catch (err) {
    console.error('Error calling Wix HTTP function:', err);
  }

  // 3) Build the Thank-You redirect URL
  let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId}`;
  const qs = new URLSearchParams();
  if (orderNumber) qs.set('orderNumber', orderNumber);
  if (objectType)  qs.set('objectType',  objectType);
  if (origin)      qs.set('origin',      origin);
  if (qs.toString()) finalUrl += `?${qs}`;

  // 4) Return 200+HTML for cPay + immediate meta-refresh
  return {
    statusCode: 200,
    headers:    { 'Content-Type': 'text/html' },
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="refresh" content="0; url=${finalUrl}" />
          <script>window.location.href='${finalUrl}';</script>
          <title>Redirecting…</title>
        </head>
        <body>
          <p>Payment successful. Redirecting…</p>
        </body>
      </html>`
  };
};

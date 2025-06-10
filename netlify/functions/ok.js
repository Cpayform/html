// File: netlify/functions/ok.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { orderId, transactionId, orderNumber, objectType, origin } =
    event.queryStringParameters || {};

  if (!orderId || !transactionId) {
    return {
      statusCode: 302,
      headers: { Location: 'https://www.mnmlbynana.com' }
    };
  }

  // Call your Wix HTTP function once
  try {
    await fetch(
      `https://www.mnmlbynana.com/_functions/use_updateTransaction`
      + `?transactionId=${encodeURIComponent(transactionId)}`
    );
  } catch (e) {
    console.error('Wix updateTransaction failed:', e);
  }

  // Redirect into your thank-you page
  let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId}`;
  const qs = new URLSearchParams();
  if (orderNumber) qs.set('orderNumber', orderNumber);
  if (objectType)  qs.set('objectType',  objectType);
  if (origin)      qs.set('origin',      origin);
  if (qs.toString()) finalUrl += `?${qs}`;

  return {
    statusCode: 200,
    headers:    { 'Content-Type': 'text/html' },
    body: `
      <!DOCTYPE html>
      <html><head>
        <meta http-equiv="refresh" content="0; url=${finalUrl}" />
        <script>window.location.href='${finalUrl}';</script>
      </head>
      <body><p>Payment successful. Redirecting…</p></body>
      </html>`
  };
};

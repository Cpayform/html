// File: netlify/functions/ok.js

exports.handler = async (event) => {
  // 1) Pull the IDs from the query
  const {
    orderId,
    transactionId,  // this is your Wix transaction ID (Details2)
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

  // 2) Call your Wix HTTP function to flip Pending → Paid
  try {
    const wixFnUrl =
      `https://www.mnmlbynana.com/_functions/updateTransaction`
      + `?transactionId=${encodeURIComponent(transactionId)}`;
    // Use built-in fetch
    const res = await fetch(wixFnUrl);
    console.log('Called updateTransaction:', res.status, await res.text());
  } catch (e) {
    console.error('Error calling updateTransaction:', e);
  }

  // 3) Build the final thank-you URL
  let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId}`;
  const qs = new URLSearchParams();
  if (orderNumber) qs.set('orderNumber', orderNumber);
  if (objectType)  qs.set('objectType',  objectType);
  if (origin)      qs.set('origin',      origin);
  if (qs.toString()) finalUrl += `?${qs}`;

  // 4) Return the 200+HTML cPay expects, with immediate meta-refresh
  return {
    statusCode: 200,
    headers:    { 'Content-Type': 'text/html' },
    body:       `
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

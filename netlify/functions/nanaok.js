// File: netlify/functions/nanaok.js

exports.handler = async (event) => {
  // 1) Pull the IDs from the query
  const {
    orderId,
    transactionId,
    orderNumber,
    objectType,
    origin
  } = event.queryStringParameters || {};

  if (!orderId || !transactionId) {
    return {
      statusCode: 302,
      headers: { Location: 'https://www.nana.mk' }
    };
  }

  // 2) Call your Wix HTTP function to flip Pending → Paid
  try {
    const wixFnUrl =
      `https://www.nana.mk/_functions/updateTransaction`
      + `?transactionId=${encodeURIComponent(transactionId)}`;

    const res = await fetch(wixFnUrl);
    console.log('Called updateTransaction:', res.status, await res.text());
  } catch (e) {
    console.error('Error calling updateTransaction (NANA):', e);
  }

  // 3) Build final thank-you URL
  let finalUrl = `https://www.nana.mk/thank-you-page`;
  
  const qs = new URLSearchParams();
  if (orderId)     qs.set('orderId', orderId);
  if (orderNumber) qs.set('orderNumber', orderNumber);
  if (objectType)  qs.set('objectType',  objectType);
  if (origin)      qs.set('origin',      origin);

  if (qs.toString()) finalUrl += `?${qs}`;

  // 4) Redirect HTML
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
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

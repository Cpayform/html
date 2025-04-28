// File: netlify/functions/ok.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // 1) Extract both IDs from the query
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
        headers: { Location: 'https://www.mnmlbynana.com' }
      };
    }

    // 2) Notify Wix that the payment succeeded
    const tokenRes = await fetch('https://www.wixapis.com/oauth/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type:    'client_credentials',
        scope:         'CASHIER.GET_ACCESS',
        client_id:     process.env.WIX_APP_ID,
        client_secret: process.env.WIX_APP_SECRET_KEY
      })
    });
    const { access_token } = await tokenRes.json();

    await fetch(
      'https://www.wixapis.com/payments/v1/provider-platform-events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type':  'application/json',
          'User-Agent':    'cPay-Netlify/1.0'
        },
        body: JSON.stringify({
          events: [{
            wixTransactionId: transactionId,
            eventType:        'PAYMENT_CAPTURED'
          }]
        })
      }
    );

    // 3) Build the final redirect into your Wix Thank-You page
    let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId}`;
    const qs = new URLSearchParams();
    if (orderNumber) qs.set('orderNumber',  orderNumber);
    if (objectType)  qs.set('objectType',   objectType);
    if (origin)      qs.set('origin',       origin);
    if (qs.toString()) finalUrl += `?${qs}`;

    // 4) Return the 200+HTML cPay expects, with an immediate meta-refresh
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
        </html>
      `
    };
  } catch (err) {
    console.error('Netlify OK.js error:', err);
    // Always return 200 so cPay doesn’t retry
    return {
      statusCode: 200,
      headers:    { 'Content-Type': 'text/html' },
      body:       `<html><body><h1>Payment processed (error).</h1></body></html>`
    };
  }
};

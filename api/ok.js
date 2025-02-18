// File: api/ok.js
export default async function handler(req, res) {
  if (req.method === 'POST' || req.method === 'GET') {
    const rawData = await req.text();
    console.log("Payment OK Callback received. Raw data:", rawData);
    
    const { orderId, orderNumber, appSectionParams } = req.query;
    let finalUrl = `https://www.mnmlbynana.com/thank-you-page/${orderId || "default"}`;
    if (orderNumber) {
      finalUrl += `?orderNumber=${orderNumber}`;
      if (appSectionParams) {
        finalUrl += `&appSectionParams=${appSectionParams}`;
      }
    }
    console.log("Redirecting to:", finalUrl);
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
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
    `);
  } else {
    res.status(405).end();
  }
}

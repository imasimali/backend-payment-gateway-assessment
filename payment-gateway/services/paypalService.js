const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID;
  let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

exports.processWithPayPal = async (amount, currency) => {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount,
        },
      },
    ],
  });

  try {
    const response = await client().execute(request);
    console.log("Order ID:", response.result.id);
    return {
      success: true,
      transactionId: response.result.id,
      redirectUrl: response.result.links[1].href,
    };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  }
};

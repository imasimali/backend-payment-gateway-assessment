import * as checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { CreditCard } from "./paymentService";

const environment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
};

const client = () => {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
};

export const processWithPayPal = async (
  amount: string,
  currency: string,
  creditCard: CreditCard
) => {
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
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
};

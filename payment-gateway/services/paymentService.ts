import * as dotenv from "dotenv";
dotenv.config();

import { processWithPayPal } from "./paypalService";
import { processWithBraintree } from "./braintreeService";
import { savePaymentToDb } from "../db/dbUtils";

export interface CreditCard {
  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
}

interface PaymentData {
  amount: string;
  currency: string;
  creditCard: CreditCard;
  customerName: string;
}

export const processPayment = async (paymentData: PaymentData) => {
  const { amount, currency, creditCard, customerName } = paymentData;
  const { number } = creditCard;

  let paymentResponse: any;
  let paymentGatewayUsed: string;

  // Determine card type based on the number; assuming AMEX if starts with 34 or 37
  const cardType =
    number.startsWith("34") || number.startsWith("37") ? "AMEX" : "OTHER";

  // Rule 3: AMEX can only be used with USD
  if (cardType === "AMEX" && currency !== "USD") {
    throw new Error("AMEX can only be used for USD transactions.");
  }

  // Rule 1 and Rule 2: Use PayPal for AMEX or currencies USD, EUR, AUD; otherwise, use Braintree
  if (cardType === "AMEX" || ["USD", "EUR", "AUD"].includes(currency)) {
    paymentResponse = await processWithPayPal(amount, currency, creditCard);
    paymentGatewayUsed = "PayPal";
  } else {
    // All other cases use Braintree, following Rule 2's "otherwise" clause
    paymentResponse = await processWithBraintree(amount, currency, creditCard);
    paymentGatewayUsed = "Braintree";
  }

  const dbData = {
    customerName,
    amount,
    currency,
    creditCardNumber: number.slice(-4), // Storing only the last 4 digits for privacy
    paymentGateway: paymentGatewayUsed,
    ...paymentResponse,
  };

  await savePaymentToDb(dbData);

  return paymentResponse;
};

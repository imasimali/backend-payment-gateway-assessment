require("dotenv").config();

const { processWithPayPal } = require("./paypalService");
const { processWithBraintree } = require("./braintreeService");
const { savePaymentToDb } = require("../db/dbUtils");

exports.processPayment = async (paymentData) => {
  const { amount, currency, creditCard, customerName } = paymentData;
  const { number } = creditCard;

  // Determine the card type (simplified version; real-world usage may require a comprehensive check)
  const cardType =
    number.startsWith("34") || number.startsWith("37") ? "AMEX" : "OTHER";

  // Check for AMEX and supported currency
  if (cardType === "AMEX" && currency !== "USD") {
    throw new Error("AMEX can only be used for USD transactions.");
  }

  let paymentResponse;
  let paymentGatewayUsed;

  // Processing payment with the appropriate gateway based on the card type and currency
  if (cardType === "AMEX" || ["USD", "EUR", "AUD"].includes(currency)) {
    paymentResponse = await processWithPayPal(amount, currency, creditCard);
    paymentGatewayUsed = "PayPal";
  } else {
    paymentResponse = await processWithBraintree(amount, currency, creditCard);
    paymentGatewayUsed = "Braintree";
  }

  // Preparing data for database insertion, ensuring security by storing only the last 4 digits of the credit card number
  const dbData = {
    customerName,
    amount,
    currency,
    creditCardNumber: number.slice(-4), // Storing only the last 4 digits
    paymentGateway: paymentGatewayUsed,
    ...paymentResponse,
  };

  // Saving the payment response and order data to the database
  await savePaymentToDb(dbData);

  return paymentResponse;
};

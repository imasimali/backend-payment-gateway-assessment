const db = require("../db/sqliteConfig");
require("dotenv").config();

const paypalService = require("./paypalService");
const braintreeService = require("./braintreeService");

exports.processPayment = async (paymentData) => {
  const { amount, currency, creditCard } = paymentData;
  const { number } = creditCard;

  // Determine the card type (simplified version; real-world usage may require a comprehensive check)
  const cardType =
    number.startsWith("34") || number.startsWith("37") ? "AMEX" : "OTHER";

  // Check for AMEX and supported currency
  if (cardType === "AMEX" && currency !== "USD") {
    throw new Error("AMEX can only be used for USD transactions.");
  }

  if (cardType === "AMEX" || ["USD", "EUR", "AUD"].includes(currency)) {
    return await paypalService.processWithPayPal(amount, currency, creditCard);
  } else {
    return await braintreeService.processWithBraintree(
      amount,
      currency,
      creditCard
    );
  }
};

import { dbRun } from "./sqliteConfig";

interface PaymentData {
  customerName: string;
  amount: string;
  currency: string;
  creditCardNumber: string;
  paymentGateway: string;
  success: boolean;
  transactionId?: string;
  message?: string;
}

export const savePaymentToDb = async (data: PaymentData): Promise<void> => {
  const {
    customerName,
    amount,
    currency,
    creditCardNumber,
    paymentGateway,
    success,
    transactionId,
    message,
  } = data;

  const query = `INSERT INTO orders (customer_name, amount, currency, credit_card_number, payment_gateway, transaction_id, success, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    await dbRun(query, [
      customerName,
      amount,
      currency,
      creditCardNumber,
      paymentGateway,
      transactionId || "",
      success ? 1 : 0,
      message || "",
    ]);
    console.log("Payment data saved to DB successfully.");
  } catch (error) {
    console.error("Failed to save payment data to DB:", error);
  }
};

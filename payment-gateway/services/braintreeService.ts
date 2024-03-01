import braintree from "braintree";
import { CreditCard } from "./paymentService";

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID!,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY!,
});

export const processWithBraintree = async (
  amount: string,
  currency: string,
  creditCard: CreditCard
) => {
  try {
    const result = await gateway.transaction.sale({
      amount,
      creditCard,
    });

    if (result.success) {
      console.log("Transaction successful:", result.transaction.id);
      return { success: true, transactionId: result.transaction.id };
    } else {
      console.log("Transaction failed:", result.message);
      return { success: false, message: result.message };
    }
  } catch (error: any) {
    console.error("Transaction error:", error);
    return { success: false, error: error.message };
  }
};

const braintree = require("braintree");

// Configure Braintree
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.processWithBraintree = async (amount, currency, creditCard) => {
  try {
    const result = await gateway.transaction.sale({
      amount: amount,
      creditCard,
    });

    if (result.success) {
      console.log("Transaction successful:", result.transaction.id);
      return { success: true, transactionId: result.transaction.id };
    } else {
      console.log("Transaction failed:", result.message);
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Transaction error:", error);
    return { success: false, error: error.message };
  }
};

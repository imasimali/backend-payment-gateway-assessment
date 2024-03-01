import { processPayment } from "../payment-gateway/services/paymentService";
import * as dbUtils from "../payment-gateway/db/dbUtils";
import * as paypalService from "../payment-gateway/services/paypalService";
import * as braintreeService from "../payment-gateway/services/braintreeService";

beforeEach(() => {
  jest.clearAllMocks();
});

// Mock the entire modules
jest.mock("../payment-gateway/db/dbUtils");
jest.mock("../payment-gateway/services/paypalService");
jest.mock("../payment-gateway/services/braintreeService");

describe("processPayment", () => {
  // Tests for PayPal usage
  it.each([
    ["USD", "371234567890123"], // AMEX in USD
    ["USD", "4111111111111111"], // Non-AMEX in USD
    ["EUR", "4111111111111111"], // Non-AMEX in EUR
    ["AUD", "4111111111111111"], // Non-AMEX in AUD
  ])(
    "should use PayPal for %s transactions with card %s",
    async (currency, number) => {
      const paymentData = {
        amount: "100",
        currency,
        creditCard: {
          number,
          expirationMonth: "12",
          expirationYear: "2030",
          cvv: "123",
        },
        customerName: "John Doe",
      };

      await processPayment(paymentData);

      expect(paypalService.processWithPayPal).toHaveBeenCalled();
      expect(dbUtils.savePaymentToDb).toHaveBeenCalled();
    }
  );

  // Test for Braintree usage
  it.each([
    ["THB", "4111111111111111"], // Non-AMEX in THB
    ["HKD", "4111111111111111"], // Non-AMEX in HKD
    ["SGD", "4111111111111111"], // Non-AMEX in SGD
  ])(
    "should use Braintree for %s transactions with non-AMEX cards",
    async (currency, number) => {
      const paymentData = {
        amount: "100",
        currency,
        creditCard: {
          number,
          expirationMonth: "12",
          expirationYear: "2030",
          cvv: "123",
        },
        customerName: "Jane Doe",
      };

      await processPayment(paymentData);

      expect(braintreeService.processWithBraintree).toHaveBeenCalled();
      expect(dbUtils.savePaymentToDb).toHaveBeenCalled();
    }
  );

  // Tests for error handling
  it("should throw an error for AMEX transactions with non-USD currency", async () => {
    const paymentData = {
      amount: "100",
      currency: "EUR", // Non-USD currency
      creditCard: {
        number: "371234567890123", // AMEX card
        expirationMonth: "12",
        expirationYear: "2030",
        cvv: "1234",
      },
      customerName: "Alex Smith",
    };

    await expect(processPayment(paymentData)).rejects.toThrow(
      "AMEX can only be used for USD transactions."
    );
  });

  // Test for failure handling
  it("should handle failure from PayPal correctly", async () => {
    (paypalService.processWithPayPal as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: "Payment declined",
    });

    const paymentData = {
      amount: "100",
      currency: "USD", // Currency that triggers PayPal
      creditCard: {
        number: "371234567890123", // AMEX, should trigger PayPal
        expirationMonth: "12",
        expirationYear: "2030",
        cvv: "1234",
      },
      customerName: "John Doe",
    };

    const result = await processPayment(paymentData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Payment declined");
    expect(paypalService.processWithPayPal).toHaveBeenCalled();
    expect(dbUtils.savePaymentToDb).toHaveBeenCalled();
  });
});

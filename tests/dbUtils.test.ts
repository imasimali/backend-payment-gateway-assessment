import { savePaymentToDb } from "../payment-gateway/db/dbUtils";
import * as sqliteConfig from "../payment-gateway/db/sqliteConfig";

jest.mock("../payment-gateway/db/sqliteConfig", () => ({
  dbRun: jest.fn().mockResolvedValue(undefined),
}));

describe("savePaymentToDb", () => {
  it("should format and execute an SQL query without errors", async () => {
    const mockDbRun = sqliteConfig.dbRun as jest.MockedFunction<
      typeof sqliteConfig.dbRun
    >;
    mockDbRun.mockResolvedValue(undefined);

    const paymentData = {
      customerName: "John Doe",
      amount: "100",
      currency: "USD",
      creditCardNumber: "1234",
      paymentGateway: "PayPal",
      success: true,
    };

    await savePaymentToDb(paymentData);

    expect(mockDbRun).toHaveBeenCalledTimes(1);
  });
});

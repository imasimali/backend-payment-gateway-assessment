import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";

export const makePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await paymentService.processPayment(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

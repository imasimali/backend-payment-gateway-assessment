import express from "express";
import { makePayment } from "../controllers/paymentController";

const router = express.Router();

router.post("/make-payment", makePayment);

export default router;

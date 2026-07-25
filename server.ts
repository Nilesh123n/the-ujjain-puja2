import express from "express";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Razorpay Config status
app.get("/api/razorpay/config", (_req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "";
  const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== "YOUR_RAZORPAY_KEY_SECRET");
  const isConfigured = Boolean(keyId && keyId !== "rzp_test_YOUR_KEY_ID" && hasSecret);

  res.json({
    keyId: keyId,
    isConfigured: isConfigured,
    upiId: process.env.VITE_UPI_ID || "9876543210@paytm",
    upiName: process.env.VITE_UPI_NAME || "Mahakal Temple Puja Services",
  });
});

// API: Create Razorpay Order
app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt = "receipt_" + Date.now(), notes = {} } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount provided" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    // Check if real keys are set
    if (
      keyId &&
      keySecret &&
      keyId !== "rzp_test_YOUR_KEY_ID" &&
      keySecret !== "YOUR_RAZORPAY_KEY_SECRET"
    ) {
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const orderOptions = {
        amount: Math.round(Number(amount) * 100), // convert to paise
        currency,
        receipt,
        notes,
      };

      const order = await instance.orders.create(orderOptions);
      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId,
      });
    } else {
      // Fallback order object for testing mode before user inputs real secret
      const mockOrderId = "order_mock_" + Date.now().toString().slice(-8);
      return res.json({
        success: true,
        isTestFallback: true,
        orderId: mockOrderId,
        amount: Math.round(Number(amount) * 100),
        currency,
        keyId: keyId || "rzp_test_YOUR_KEY_ID",
        message: "Razorpay initialized in test mode. Add RAZORPAY_KEY_SECRET in secrets for real payment processing.",
      });
    }
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: error.message || "Failed to create Razorpay order" });
  }
});

// API: Verify Razorpay Payment Signature
app.post("/api/razorpay/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    if (!keySecret || keySecret === "YOUR_RAZORPAY_KEY_SECRET") {
      // In test fallback mode
      return res.json({
        success: true,
        verified: true,
        message: "Payment recorded successfully in test mode.",
      });
    }

    const bodyData = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(bodyData.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({
        success: true,
        verified: true,
        message: "Razorpay payment signature verified successfully.",
      });
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        error: "Invalid Razorpay payment signature verification failed.",
      });
    }
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: error.message || "Verification server error" });
  }
});

// Vite Middleware & Static Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

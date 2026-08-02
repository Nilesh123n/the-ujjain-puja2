import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { createServer as createViteServer } from "vite";
// @ts-ignore
import supabase from "./db.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Ensure upload & data directories exist
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const customizationFilePath = path.join(dataDir, "customization.json");

// Serve uploaded images statically
app.use("/uploads", express.static(uploadsDir));

// API: Image Upload Handler (Supabase Storage + Local Fallback)
app.post("/api/upload-image", async (req, res) => {
  try {
    const { image, fileName } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "No image data provided" });
    }

    let extension = "png";
    let base64Data = image;
    let mimeType = "image/png";

    const matches = image.match(/^data:(image\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      extension = matches[1].split("/")[1] === "jpeg" ? "jpg" : matches[1].split("/")[1];
      base64Data = matches[2];
    } else if (image.includes(",")) {
      base64Data = image.split(",")[1];
    }

    const buffer = Buffer.from(base64Data, "base64");
    const sanitizedFileName = fileName
      ? `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9_.-]/g, "_")}`
      : `img_${Date.now()}_${Math.floor(Math.random() * 10000)}.${extension}`;

    // Always save locally first as backup
    const targetPath = path.join(uploadsDir, sanitizedFileName);
    fs.writeFileSync(targetPath, buffer);
    const localUrl = `/uploads/${sanitizedFileName}`;

    let finalUrl = localUrl;
    let storedInSupabase = false;

    // Try uploading to Supabase Storage if client is available
    if (supabase) {
      try {
        const bucketName = "pujas";

        let { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(sanitizedFileName, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadError && uploadError.message?.toLowerCase().includes("not found")) {
          // Attempt bucket creation if not exists
          await supabase.storage.createBucket(bucketName, { public: true });
          const retry = await supabase.storage
            .from(bucketName)
            .upload(sanitizedFileName, buffer, {
              contentType: mimeType,
              upsert: true,
            });
          uploadData = retry.data;
          uploadError = retry.error;
        }

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(sanitizedFileName);

          if (publicUrlData && publicUrlData.publicUrl) {
            finalUrl = publicUrlData.publicUrl;
            storedInSupabase = true;
            console.log(`Saved image to Supabase Storage: ${finalUrl}`);
          }
        } else {
          console.warn("Supabase Storage upload warning:", uploadError.message);
        }
      } catch (sbErr: any) {
        console.warn("Supabase storage error, using local fallback:", sbErr.message || sbErr);
      }
    }

    return res.json({
      success: true,
      url: finalUrl,
      supabase: storedInSupabase,
      message: storedInSupabase
        ? "Image uploaded and stored in Supabase Storage"
        : "Image stored locally",
    });
  } catch (error: any) {
    console.error("Image upload server error:", error);
    return res.status(500).json({ error: error.message || "Failed to upload image" });
  }
});

// API: Customization Database GET (Supabase + Local Cache)
app.get("/api/customization", async (_req, res) => {
  try {
    let supabaseData: any = null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("customization")
          .select("*")
          .limit(1);

        if (!error && data && data.length > 0) {
          const record = data[0];
          supabaseData = {
            heroContent: record.hero_content || record.heroContent,
            pujas: record.pujas,
          };
        } else {
          const { data: pujaData, error: pujaError } = await supabase
            .from("puja")
            .select("*");

          if (!pujaError && pujaData && pujaData.length > 0) {
            let localHero = null;
            if (fs.existsSync(customizationFilePath)) {
              const raw = fs.readFileSync(customizationFilePath, "utf-8");
              localHero = JSON.parse(raw)?.heroContent;
            }
            supabaseData = {
              heroContent: localHero,
              pujas: pujaData,
            };
          }
        }
      } catch (sbErr: any) {
        console.warn("Supabase GET customization notice:", sbErr.message || sbErr);
      }
    }

    if (
      supabaseData &&
      (supabaseData.heroContent ||
        (Array.isArray(supabaseData.pujas) && supabaseData.pujas.length > 0))
    ) {
      return res.json({ success: true, data: supabaseData, source: "supabase" });
    }

    if (fs.existsSync(customizationFilePath)) {
      const rawData = fs.readFileSync(customizationFilePath, "utf-8");
      const data = JSON.parse(rawData);
      return res.json({ success: true, data, source: "local" });
    }

    return res.json({ success: true, data: null });
  } catch (error: any) {
    console.error("Error reading customization file:", error);
    return res.status(500).json({ error: error.message || "Failed to read customization data" });
  }
});

// API: Customization Database POST (Supabase + Local Cache)
app.post("/api/customization", async (req, res) => {
  try {
    const { heroContent, pujas } = req.body;
    const payload = {
      heroContent,
      pujas,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(customizationFilePath, JSON.stringify(payload, null, 2), "utf-8");

    let savedToSupabase = false;

    if (supabase) {
      try {
        const { error: upsertError } = await supabase
          .from("customization")
          .upsert(
            {
              id: 1,
              hero_content: heroContent,
              heroContent: heroContent,
              pujas: pujas,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

        if (!upsertError) {
          savedToSupabase = true;
          console.log("Customization saved to Supabase 'customization' table successfully.");
        } else {
          console.warn("Supabase customization table info:", upsertError.message);
        }

        if (Array.isArray(pujas) && pujas.length > 0) {
          try {
            await supabase.from("puja").upsert(pujas, { onConflict: "id" });
          } catch (e) {
            // Ignore if schema mismatch
          }
        }
      } catch (sbErr: any) {
        console.warn("Supabase POST error:", sbErr.message || sbErr);
      }
    }

    return res.json({
      success: true,
      message: savedToSupabase
        ? "Saved to Supabase Database"
        : "Saved to local storage",
      supabase: savedToSupabase,
    });
  } catch (error: any) {
    console.error("Error writing customization file:", error);
    return res.status(500).json({ error: error.message || "Failed to save customization data" });
  }
});

// API: Razorpay Config status
app.get("/api/razorpay/config", (_req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_live_TKQ0HEnQP01Sze";
  const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== "YOUR_RAZORPAY_KEY_SECRET");
  const isConfigured = Boolean(keyId && keyId !== "rzp_test_YOUR_KEY_ID" && hasSecret);

  res.json({
    keyId: keyId,
    isConfigured: isConfigured,
    upiId: process.env.VITE_UPI_ID || "ramayentertainment@ybl",
    upiName: process.env.VITE_UPI_NAME || "The Ujjain Puja Services",
  });
});

// API: Create Razorpay Order
app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt = "receipt_" + Date.now(), notes = {} } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount provided" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_live_TKQ0HEnQP01Sze";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "O1IJxdSRwJ6L614vR40cwDNQ";

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

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "O1IJxdSRwJ6L614vR40cwDNQ";

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

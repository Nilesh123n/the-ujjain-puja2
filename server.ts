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

// API: Image Upload Handler (Supabase Storage with local static fallback)
app.post("/api/upload-image", async (req, res) => {
  try {
    const { image, fileName, filename } = req.body;
    const originalName = fileName || filename || "";
    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, error: "No image data provided in request body" });
    }

    let extension = "png";
    let base64Data = image;
    let mimeType = "image/png";

    const matches = image.match(/^data:(image\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      const subtype = matches[1].split("/")[1] || "png";
      extension = subtype === "jpeg" ? "jpg" : subtype.replace(/[^a-zA-Z0-9]/g, "");
      base64Data = matches[2];
    } else if (image.includes(",")) {
      base64Data = image.split(",")[1];
    }

    const buffer = Buffer.from(base64Data, "base64");
    const randomHex = crypto.randomBytes(6).toString("hex");
    const timeStamp = Date.now();
    const sanitizedOriginal = originalName ? originalName.replace(/[^a-zA-Z0-9_.-]/g, "_") : "";
    const uniqueFilename = sanitizedOriginal
      ? `${timeStamp}_${randomHex}_${sanitizedOriginal}`
      : `img_${timeStamp}_${randomHex}.${extension}`;

    // Write file securely into public/uploads/ directory
    const targetPath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(targetPath, buffer);
    const localUrl = `/uploads/${uniqueFilename}`;

    let finalUrl = localUrl;
    let storedInSupabase = false;

    // Try uploading to Supabase Storage if client is available
    if (supabase) {
      try {
        const bucketName = "pujas";

        let { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(uniqueFilename, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadError && uploadError.message?.toLowerCase().includes("not found")) {
          const { error: createErr } = await supabase.storage.createBucket(bucketName, { public: true });
          if (!createErr) {
            const retry = await supabase.storage
              .from(bucketName)
              .upload(uniqueFilename, buffer, {
                contentType: mimeType,
                upsert: true,
              });
            uploadError = retry.error;
          }
        }

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(uniqueFilename);

          if (publicUrlData && publicUrlData.publicUrl) {
            finalUrl = publicUrlData.publicUrl;
            storedInSupabase = true;
            console.log(`Saved image to Supabase Storage: ${finalUrl}`);
          }
        } else {
          console.warn("Supabase Storage upload notice, using local file URL:", uploadError.message);
        }
      } catch (sbErr: any) {
        console.warn("Supabase storage server upload exception, using local fallback:", sbErr.message || sbErr);
      }
    }

    return res.json({
      success: true,
      url: finalUrl,
      localUrl: localUrl,
      supabase: storedInSupabase,
      message: storedInSupabase
        ? "Image uploaded and stored in Supabase Storage"
        : "Image stored locally on server",
    });
  } catch (error: any) {
    console.error("Image upload server error:", error);
    return res.status(500).json({
      success: false,
      error: `Server upload exception: ${error.message || error}`,
    });
  }
});

// API: Customization Database GET (Supabase + Local Cache)
app.get("/api/customization", async (_req, res) => {
  try {
    let supabaseData: any = null;
    let lastError: string | null = null;

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
          if (error) {
            lastError = `'customization' table error: ${error.message}`;
          }
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
          } else if (pujaError) {
            lastError = `${lastError ? lastError + ' | ' : ''}'puja' table error: ${pujaError.message}`;
          }
        }
      } catch (sbErr: any) {
        lastError = sbErr.message || String(sbErr);
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
      return res.json({ success: true, data, source: "local", supabaseNotice: lastError });
    }

    return res.json({ success: true, data: null, supabaseNotice: lastError });
  } catch (error: any) {
    console.error("Error reading customization file:", error);
    return res.status(500).json({ error: error.message || "Failed to read customization data" });
  }
});

// API: Customization Database POST (Supabase + Local Cache with robust handling)
app.post("/api/customization", async (req, res) => {
  try {
    let { heroContent, pujas } = req.body;

    // Helper to auto-convert base64 image strings to server file URLs
    const convertBase64ToFileUrl = (imgStr: string): string => {
      if (!imgStr || typeof imgStr !== "string" || !imgStr.startsWith("data:image/")) {
        return imgStr;
      }
      try {
        let extension = "png";
        let base64Data = imgStr;
        let mimeType = "image/png";

        const matches = imgStr.match(/^data:(image\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          const subtype = matches[1].split("/")[1] || "png";
          extension = subtype === "jpeg" ? "jpg" : subtype.replace(/[^a-zA-Z0-9]/g, "");
          base64Data = matches[2];
        } else if (imgStr.includes(",")) {
          base64Data = imgStr.split(",")[1];
        }

        const buffer = Buffer.from(base64Data, "base64");
        const randomHex = crypto.randomBytes(6).toString("hex");
        const uniqueFilename = `auto_img_${Date.now()}_${randomHex}.${extension}`;
        const targetPath = path.join(uploadsDir, uniqueFilename);
        fs.writeFileSync(targetPath, buffer);
        console.log(`Auto-converted base64 image to server file: /uploads/${uniqueFilename}`);
        return `/uploads/${uniqueFilename}`;
      } catch (err) {
        console.warn("Error converting base64 image to file:", err);
        return imgStr;
      }
    };

    // Auto-sanitize heroContent bgImage if base64
    if (heroContent && typeof heroContent.bgImage === "string") {
      heroContent.bgImage = convertBase64ToFileUrl(heroContent.bgImage);
    }

    // Auto-sanitize pujas images if base64
    if (Array.isArray(pujas)) {
      pujas = pujas.map((p: any) => ({
        ...p,
        image: typeof p.image === "string" ? convertBase64ToFileUrl(p.image) : p.image,
      }));
    }

    const payload = {
      heroContent,
      pujas,
      updatedAt: new Date().toISOString(),
    };

    // Always save locally to data/customization.json as primary fallback
    fs.writeFileSync(customizationFilePath, JSON.stringify(payload, null, 2), "utf-8");

    let supabaseSaved = false;
    let supabaseNotice: string | null = null;

    if (supabase) {
      try {
        const errors: string[] = [];

        // 1. Save to customization table if present in Supabase
        const { error: customError } = await supabase
          .from("customization")
          .upsert(
            {
              id: 1,
              hero_content: heroContent,
              pujas: pujas,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

        if (customError) {
          console.warn("Supabase customization table notice:", customError.message);
          errors.push(`customization table: ${customError.message}`);
        }

        // 2. Save to puja table with full and fallback schema
        if (Array.isArray(pujas) && pujas.length > 0) {
          const fullPujaRows = pujas.map((p: any) => ({
            id: typeof p.id === "number" ? p.id : parseInt(String(p.id)) || Date.now(),
            title: p.name || p.title || "Puja Seva",
            price: typeof p.price === "number" ? p.price : parseInt(String(p.price).replace(/[^0-9]/g, "")) || 0,
            description: p.description || p.shortDesc || "",
            image: p.image || "",
            category: p.category || "",
            location: p.location || "",
            duration: p.duration || "",
            pandits: p.pandits || "",
          }));

          let { error: pujaError } = await supabase
            .from("puja")
            .upsert(fullPujaRows, { onConflict: "id" });

          // If full columns fail because table only has basic columns, retry with basic columns
          if (pujaError && (pujaError.code === "PGRST204" || pujaError.message.includes("column"))) {
            const basicPujaRows = pujas.map((p: any) => ({
              id: typeof p.id === "number" ? p.id : parseInt(String(p.id)) || Date.now(),
              title: p.name || p.title || "Puja Seva",
              price: typeof p.price === "number" ? p.price : parseInt(String(p.price).replace(/[^0-9]/g, "")) || 0,
              description: p.description || p.shortDesc || "",
            }));

            const retryResult = await supabase
              .from("puja")
              .upsert(basicPujaRows, { onConflict: "id" });

            pujaError = retryResult.error;
          }

          if (pujaError) {
            console.warn("Supabase puja table notice:", pujaError.message);
            errors.push(`puja table: ${pujaError.message}`);
          }
        }

        if (errors.length === 0) {
          supabaseSaved = true;
        } else {
          supabaseNotice = errors.join(" | ");
        }
      } catch (sbErr: any) {
        console.warn("Supabase customization upsert exception:", sbErr);
        supabaseNotice = sbErr.message || String(sbErr);
      }
    } else {
      supabaseNotice = "Supabase client not configured on server";
    }

    return res.json({
      success: true,
      data: payload,
      supabase: supabaseSaved,
      supabaseNotice: supabaseNotice,
      message: supabaseSaved
        ? "Customization successfully saved to Supabase Database"
        : "Customization saved locally",
    });
  } catch (error: any) {
    console.error("Error writing customization data:", error);
    return res.status(500).json({
      success: false,
      error: `Server customization save exception: ${error.message || error}`,
    });
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

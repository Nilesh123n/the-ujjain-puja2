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
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Serve static assets from public folder
app.use(express.static(path.join(process.cwd(), "public")));

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

function getStoredCustomization(): any {
  try {
    if (fs.existsSync(customizationFilePath)) {
      const raw = fs.readFileSync(customizationFilePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Error reading stored customization:", err);
  }
  return {};
}

function saveCustomizationData(data: any): void {
  try {
    fs.writeFileSync(customizationFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Error writing customization data:", err);
  }
}

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
        const bucketName = "puja-images";

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

// Server In-Memory Cache for Customization to prevent Supabase Egress Overuse
let serverCustomizationCache: { data: any; timestamp: number } | null = null;
const SERVER_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// API: Customization Database GET (Supabase + Local Cache)
app.get("/api/customization", async (_req, res) => {
  try {
    const now = Date.now();
    if (serverCustomizationCache && (now - serverCustomizationCache.timestamp < SERVER_CACHE_TTL_MS)) {
      return res.json({ success: true, data: serverCustomizationCache.data, source: "memory_cache" });
    }

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
      serverCustomizationCache = { data: supabaseData, timestamp: Date.now() };
      return res.json({ success: true, data: supabaseData, source: "supabase" });
    }

    if (fs.existsSync(customizationFilePath)) {
      const rawData = fs.readFileSync(customizationFilePath, "utf-8");
      const data = JSON.parse(rawData);
      serverCustomizationCache = { data, timestamp: Date.now() };
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

    // Always save locally to data/customization.json as primary fallback and update server cache
    fs.writeFileSync(customizationFilePath, JSON.stringify(payload, null, 2), "utf-8");
    serverCustomizationCache = { data: payload, timestamp: Date.now() };

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
  const cust = getStoredCustomization() || {};
  const keyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || cust.razorpayKeyId || "").trim();
  const hasSecret = Boolean((process.env.RAZORPAY_KEY_SECRET || cust.razorpayKeySecret || "").trim());
  const upiId = (process.env.VITE_UPI_ID || cust.upiId || "ramayentertainment@ybl").trim();
  const upiName = (process.env.VITE_UPI_NAME || cust.upiName || "The Ujjain Puja Services").trim();

  res.json({
    keyId: keyId,
    isConfigured: Boolean(keyId),
    hasSecret: hasSecret,
    upiId: upiId,
    upiName: upiName,
  });
});

// API: Create Razorpay Order
app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt = "receipt_" + Date.now(), notes = {}, clientKeyId } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount provided" });
    }

    const cust = getStoredCustomization() || {};
    const keyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || cust.razorpayKeyId || clientKeyId || "").trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || cust.razorpayKeySecret || "").trim();

    // Check if both key and secret credentials exist
    if (keyId && keySecret && keyId.startsWith("rzp_")) {
      try {
        const instance = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const orderOptions = {
          amount: Math.round(Number(amount) * 100), // convert to paise
          currency,
          receipt: String(receipt).slice(0, 40),
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
      } catch (rzpApiError: any) {
        console.warn("Razorpay API order creation warning:", rzpApiError?.description || rzpApiError?.message || rzpApiError);
        return res.json({
          success: true,
          isDirectFallback: true,
          orderId: null,
          amount: Math.round(Number(amount) * 100),
          currency,
          keyId: keyId,
          message: rzpApiError?.description || rzpApiError?.message || "Direct SDK mode",
        });
      }
    } else {
      return res.json({
        success: true,
        isDirectFallback: true,
        orderId: null,
        amount: Math.round(Number(amount) * 100),
        currency,
        keyId: keyId,
        message: "Key/Secret not configured on server",
      });
    }
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    res.status(200).json({
      success: true,
      isDirectFallback: true,
      orderId: null,
      amount: Math.round(Number(req.body?.amount || 0) * 100),
      currency: "INR",
      keyId: "",
      message: error.message || "Fallback mode activated",
    });
  }
});

// Helper for server-side bookings persistence
const bookingsFilePath = path.join(dataDir, "bookings.json");

function getStoredBookings(): any[] {
  if (!fs.existsSync(bookingsFilePath)) return [];
  try {
    const raw = fs.readFileSync(bookingsFilePath, "utf-8");
    return JSON.parse(raw) || [];
  } catch (e) {
    return [];
  }
}

function saveBookingRecord(booking: any) {
  try {
    const existing = getStoredBookings();
    const index = existing.findIndex((b: any) => 
      (b.bookingId && b.bookingId === booking.bookingId) || 
      (b.paymentId && b.paymentId === booking.paymentId)
    );

    if (index >= 0) {
      existing[index] = { ...existing[index], ...booking };
    } else {
      existing.unshift(booking);
    }

    fs.writeFileSync(bookingsFilePath, JSON.stringify(existing, null, 2), "utf-8");
    console.log(`Saved booking ${booking.bookingId} (${booking.paymentId}) to data/bookings.json`);

    // Try saving to Supabase if available
    if (supabase) {
      supabase.from("bookings").upsert([{
        booking_id: booking.bookingId,
        full_name: booking.fullName,
        phone: booking.phone,
        email: booking.email,
        puja_name: booking.pujaName,
        puja_date: booking.pujaDate,
        amount: booking.pujaPrice,
        payment_id: booking.paymentId,
        payment_status: booking.paymentStatus,
        raw_notes: JSON.stringify(booking),
        created_at: new Date().toISOString()
      }], { onConflict: "booking_id" })
      .then(({ error }: any) => {
        if (error) {
          console.warn("Supabase bookings table notice (webhook save):", error.message);
        } else {
          console.log("Booking saved to Supabase 'bookings' table");
        }
      }).catch((sbErr: any) => {
        console.warn("Supabase bookings save exception:", sbErr.message || sbErr);
      });
    }

    return true;
  } catch (err) {
    console.error("Error saving booking record:", err);
    return false;
  }
}

// API: Verify Razorpay Payment Signature
app.post("/api/razorpay/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "ywZ9PwaRiRpsZjGQwkI0Itbk";

    if (!keySecret) {
      // Direct / Fallback verified response
      return res.json({
        success: true,
        verified: true,
        message: "Payment recorded successfully.",
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
  } catch (err: any) {
    console.error("Error verifying payment signature:", err);
    res.status(500).json({ success: false, error: "Signature verification error: " + err.message });
  }
});

// API: Razorpay Webhook Endpoint (/api/webhooks/razorpay)
app.post("/api/webhooks/razorpay", async (req, res) => {
  console.log("🔔 Received Razorpay Webhook Event:", req.body?.event);

  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"] as string;

    // Verify webhook signature if secret is provided in env
    if (webhookSecret && signature) {
      try {
        const bodyStr = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        const expectedSignature = crypto
          .createHmac("sha256", webhookSecret)
          .update(bodyStr)
          .digest("hex");

        if (expectedSignature !== signature) {
          console.warn("⚠️ Webhook signature mismatch! Please check RAZORPAY_WEBHOOK_SECRET.");
        } else {
          console.log("✅ Razorpay Webhook Signature verified successfully.");
        }
      } catch (sigErr) {
        console.warn("Webhook signature check error:", sigErr);
      }
    }

    const event = req.body?.event;
    const payload = req.body?.payload;

    // Process payment.captured or order.paid
    if (event === "payment.captured" || event === "order.paid") {
      const payment = payload?.payment?.entity || payload?.order?.entity;

      if (payment) {
        const paymentId = payment.id || payment.payment_id || `pay_${Date.now()}`;
        const orderId = payment.order_id || `order_${Date.now()}`;
        const rawAmount = payment.amount ? Math.round(payment.amount / 100) : 0;
        const notes = payment.notes || {};

        const bookingId = notes.bookingId || orderId || `UJP_${Date.now().toString().slice(-6)}`;
        const customerName = notes.customerName || notes.fullName || notes.name || payment.email?.split("@")[0] || "Devotee";
        const customerPhone = notes.customerPhone || notes.phone || payment.contact || "N/A";
        const customerEmail = payment.email || notes.email || "";
        const pujaName = notes.pujaName || notes.puja || "Ujjain Mahakal Puja Seva";
        const pujaDate = notes.bookingDate || notes.pujaDate || new Date().toISOString().split("T")[0];
        const gotra = notes.gotra || "Kashyap";
        const pujaType = notes.pujaType || "Special Seva";

        const newBookingRecord = {
          bookingId: bookingId,
          pujaId: notes.pujaId || 1,
          pujaName: pujaName,
          pujaPrice: rawAmount,
          priceDisplay: `₹${rawAmount.toLocaleString("en-IN")}`,
          fullName: customerName,
          phone: customerPhone,
          email: customerEmail,
          pujaDate: pujaDate,
          pujaType: pujaType,
          city: notes.city || "Ujjain",
          gotra: gotra,
          paymentMethod: payment.method ? `Razorpay (${payment.method.toUpperCase()})` : "Razorpay Online / UPI",
          paymentId: paymentId,
          orderId: orderId,
          paymentStatus: "SUCCESS",
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          notes: notes
        };

        // Save booking to server data storage and Supabase
        saveBookingRecord(newBookingRecord);

        console.log(`🎉 Webhook payment.captured handled: ${paymentId} for ${customerName} (${bookingId})`);
      }
    }

    // Always respond promptly with 200 OK so Razorpay doesn't consider webhook failed
    return res.status(200).json({ status: "ok", message: "Razorpay webhook received successfully" });
  } catch (err: any) {
    console.error("Error processing Razorpay Webhook:", err);
    return res.status(200).json({ status: "ok", warning: err.message });
  }
});

// API: Get and Post Admin Bookings
app.get("/api/admin/bookings", async (_req, res) => {
  try {
    const bookings = getStoredBookings();
    return res.json({ success: true, data: bookings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/admin/bookings", async (req, res) => {
  try {
    const booking = req.body;
    if (!booking || (!booking.bookingId && !booking.paymentId)) {
      return res.status(400).json({ success: false, error: "Invalid booking data" });
    }
    saveBookingRecord(booking);
    return res.json({ success: true, message: "Booking recorded on server" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Vite Middleware & Static Server
async function startServer() {
  const currentKeyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  console.log("NODE_ENV =", process.env.NODE_ENV || "development");
  console.log("PORT =", PORT);
  console.log("KEY =", currentKeyId || "Not set");
  console.log("SECRET =", !!process.env.RAZORPAY_KEY_SECRET);

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

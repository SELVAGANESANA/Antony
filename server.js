const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const Razorpay = require("razorpay");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serves payment.html

// ✅ Razorpay keys
const razorpay = new Razorpay({
  key_id: "rzp_live_gfoS1OjC8tvWjP",
  key_secret: "B0q7JAz8YhMat2QkTa3YCUGd"
});

// ✅ SendGrid setup
sgMail.setApiKey("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"); // 🔐 Your verified SendGrid API Key

app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// 🔄 Create Razorpay Order
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt_" + Date.now(),
    payment_capture: 1
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    res.status(500).send("Order creation failed");
  }
});

// ✅ Handle successful payment & send email
app.post("/payment-success", async (req, res) => {
  const { email, amount, payment_id } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ success: false, message: "Missing email or amount" });
  }

  const msg = {
    to: "techtycoondigitalsolutions@gmail.com",          // ✅ Your vendor email
    from: "techtycoon@aitycoon.in",  // ✅ Must be verified in SendGrid
    subject: "💰 New Payment Received",
    html: `
      <h2>Payment Details</h2>
      <p><strong>Client Email:</strong> ${email}</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>Payment ID:</strong> ${payment_id}</p>
      <p>Status: ✅ Successful</p>
    `,
    replyTo: email
  };

  try {
    await sgMail.send(msg);
    console.log("📧 Email sent to vendor");
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Email failed:", err.response?.body || err.message);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});

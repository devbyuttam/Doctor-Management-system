const Razorpay = require("razorpay");
const crypto = require("crypto");

const isConfigured = !!(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);

let razorpay = null;
if (isConfigured) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const createOrder = async (amount, receipt) => {
  if (!isConfigured) return { configured: false };
  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: receipt.toString(),
  };
  return await razorpay.orders.create(options);
};

const verifySignature = (orderId, paymentId, signature) => {
  if (!isConfigured) return false;
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest("hex");
  return generatedSignature === signature;
};

module.exports = { createOrder, verifySignature, isConfigured };

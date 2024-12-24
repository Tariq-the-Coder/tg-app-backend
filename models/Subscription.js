const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  tier: { type: String, enum: ["day", "week", "month"], required: true },
  expiration: { type: Date, required: true },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);

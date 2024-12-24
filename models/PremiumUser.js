const mongoose = require("mongoose");

const premiumUserSchema = new mongoose.Schema({
  userAddress: { type: String, required: true, unique: true },
  subscriptionType: { type: String, required: true },
  amount: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  status: { type: String, default: "Active" },
  tx_hash: { type: String },
});

const PremiumUser = mongoose.model("PremiumUser", premiumUserSchema);
module.exports = PremiumUser;

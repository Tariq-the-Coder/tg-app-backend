const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  subscriptionType: { type: String, required: true },
  amount: { type: String, required: true },
  txsendtime: { type: Date, required: true },
  boc: { type: String, required: true },
  msg_hash: { type: String, required: true },
  tx_hash: { type: String },
  status: { type: String, default: "Pending" },
  isPremium: { type: Boolean, default: false },
  expirationDate: { type: Date },
});

TransactionSchema.methods.calculateExpiration = function() {
  let expirationDate;
  if (this.subscriptionType === 'day') {
      expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);
  } else if (this.subscriptionType === 'week') {
      expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
  } else if (this.subscriptionType === 'month') {
      expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);
  }
  this.expirationDate = expirationDate;
};

const Transaction = mongoose.model("Transaction", TransactionSchema);


module.exports = Transaction;

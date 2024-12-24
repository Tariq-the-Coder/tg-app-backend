// controllers/paymentController.js
const Transaction = require("../models/Transaction"); // Your database model for transactions

// Save Transaction
const saveTransaction = async (req, res) => {
  try {
    const { userAddress, subscriptionType, amount, txsendtime, boc, msg_hash, status } = req.body;

    // Log received values for debugging
    console.log("Received subscriptionType (tier):", subscriptionType);

    // Validate subscriptionType (tier)
    const validTiers = ["day", "week", "month"];
    if (!validTiers.includes(subscriptionType)) {
      console.error(`Invalid tier provided: ${subscriptionType}`);
      return res.status(400).json({
        success: false,
        message: `Invalid tier provided: ${subscriptionType}`,
      });
    }

    // Create a new transaction record
    const newTransaction = new Transaction({
      userAddress,
      subscriptionType, // Directly use the provided tier
      amount,
      txsendtime,
      boc,
      msg_hash,
      status,
    });

    // Save the transaction in the database
    await newTransaction.save();

    // Respond with a success message
    res.status(201).json({
      success: true,
      message: "Transaction saved successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error in saveTransaction:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all pending transactions
const getPendingTransactions = async (req, res) => {
  try {
    // Extract the wallet address from query parameters
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    // Find transactions with status "Pending" and matching wallet address
    const pendingTransactions = await Transaction.find({
      userAddress: address,
    });

    // Respond with the list of pending transactions
    if (pendingTransactions.length > 0) {
      res.status(200).json({ pendingTransactions });
    } else {
      res.status(404).json({ message: "No pending transactions found for this wallet" });
    }
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Check and Update Transaction Status
const checkStatus = async (req, res) => {
  try {
      const { msg_hash, tx_hash } = req.body;

      if (!msg_hash || !tx_hash) {
          return res.status(400).json({
              success: false,
              message: "Message hash and transaction hash are required.",
          });
      }

      // Find the transaction by message hash
      const transaction = await Transaction.findOne({ msg_hash });
      if (!transaction) {
          return res.status(404).json({
              success: false,
              message: "Transaction not found.",
          });
      }

      // Validate subscriptionType
      const { subscriptionType } = transaction;
      if (!["day", "week", "month"].includes(subscriptionType)) {
          return res.status(400).json({
              success: false,
              message: "Invalid subscription type in transaction.",
          });
      }

      // Check if already confirmed
      if (transaction.status === "Confirmed") {
          return res.status(200).json({
              success: true,
              message: "Transaction already confirmed.",
              transaction,
          });
      }

      // Update transaction to confirmed
      transaction.status = "Confirmed";
      transaction.tx_hash = tx_hash;

      // Set isPremium based on subscriptionType
      transaction.isPremium = true;

      // Calculate expiration date based on subscriptionType
      const now = new Date();
      if (subscriptionType === "day") {
          transaction.expirationDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 day
      } else if (subscriptionType === "week") {
          transaction.expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      } else if (subscriptionType === "month") {
          transaction.expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }

      // Save the updated transaction
      await transaction.save();

      // Log the updated transaction for debugging
      console.log("Updated transaction:", transaction);

      // Respond with success
      return res.status(200).json({
          success: true,
          message: "Transaction updated to 'Confirmed' with expiration date set",
          transaction,
      });
  } catch (error) {
      console.error("Error in checkStatus:", error);
      return res.status(500).json({
          success: false,
          message: "An error occurred while updating the transaction.",
      });
  }
};


const updateTransactionStatus = async (req, res) => {
  const { userAddress, status, expirationDate } = req.body;
  console.log(req.body);
  

  try {
    // Check if the provided status is "Confirmed" and expirationDate is passed
    const currentDate = new Date();
    const expirationDateTime = new Date(expirationDate); // Convert expiration date to Date object

    if (status !== "Confirmed" || expirationDateTime >= currentDate) {
      return res.status(400).json({ message: "Transaction is not eligible for status update." });
    }

    // Find the transaction for the given userAddress and isPremium true
    const transaction = await Transaction.findOne({
      userAddress: userAddress,      // Filter by user address
      isPremium: true,               // Check if it's a premium transaction
      status: "Confirmed",           // Check if the status is confirmed
    });

    // If the transaction is found and expired, update the status
    if (transaction) {
      transaction.status = "Expired"; // Update the status
      transaction.isPremium= false,
      await transaction.save(); // Save the updated transaction
      return res.status(200).json({ message: "Transaction status updated to Expired", transaction });
    } else {
      return res.status(404).json({ message: "No matching transaction found." });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return res.status(500).json({ error: "Failed to update transaction status." });
  }
};
  
  module.exports = { saveTransaction, getPendingTransactions, checkStatus, updateTransactionStatus };

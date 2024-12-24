// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { saveTransaction, getPendingTransactions, checkStatus, updateTransactionStatus } = require("../controllers/paymentController");

// This route will match POST /api/payments/saveTransaction
router.post("/saveTransaction", saveTransaction);

// This route will match GET /api/payments/getPendingTransactions
router.get("/getPendingTransactions", getPendingTransactions);

// Route for checking and updating transaction status
router.post("/check-status", checkStatus);


router.post("/updateTransactionStatus", updateTransactionStatus)
module.exports = router;

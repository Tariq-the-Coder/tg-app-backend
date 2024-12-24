const express = require("express");
const { addTradingCall, getTradingCalls } = require("../controllers/adminController");
const router = express.Router();

router.post("/add-call", addTradingCall);
router.get("/get-calls", getTradingCalls);

module.exports = router;

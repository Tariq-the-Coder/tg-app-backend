const AdminCall = require("../models/AdminCall");

exports.addTradingCall = async (req, res) => {
  const { title, description, callDetails } = req.body;

  try {
    const newCall = await AdminCall.create({ title, description, callDetails });
    res.status(201).json({ message: "Trading call added successfully", newCall });
  } catch (error) {
    res.status(500).json({ message: "Error adding trading call", error: error.message });
  }
};

exports.getTradingCalls = async (req, res) => {
  try {
    const calls = await AdminCall.find({});
    res.status(200).json({ calls });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

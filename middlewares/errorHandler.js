module.exports = (err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  };
  
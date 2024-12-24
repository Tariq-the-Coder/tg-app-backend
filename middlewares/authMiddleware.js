module.exports = (req, res, next) => {
    const { adminKey } = req.headers;
  
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ message: "Access denied" });
    }
  
    next();
  };
  
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = { id: decoded.id };
    next(); 
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};



module.exports = authenticateToken;

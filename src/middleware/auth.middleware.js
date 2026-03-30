const jwt = require("jsonwebtoken");
const userModel = require("../db/models/user.model");
async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send("Unauthorized");
  }
}
async function isAdmin(req, res, next) {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    } else {
      res.status(403).send("Forbidden");
    }
  } catch (error) {
    console.error("Error checking admin role:", error);
    res.status(500).send("Internal Server Error");
  }
}
module.exports = {
  verifyToken,
  isAdmin,
};

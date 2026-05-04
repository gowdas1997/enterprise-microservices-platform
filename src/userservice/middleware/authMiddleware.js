const jwt = require("jsonwebtoken");
const { getSecret } = require("../db");

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const secretData = await getSecret(process.env.JWT_SECRET_NAME);

    const decoded = jwt.verify(
      token,
      secretData.jwt_secret
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  authenticateToken,
};
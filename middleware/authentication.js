const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    throw new UnauthenticatedError("Autenticação invalida");

  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the routes
    const testUser = payload.userId === "63594b90b93f7c4d4a757b9e";

    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Autenticação invalida");
  }
};

module.exports = auth;

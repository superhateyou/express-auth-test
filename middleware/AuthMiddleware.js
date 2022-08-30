import jwt from "jsonwebtoken";
import key from "../config.js";

const AuthMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split("")[1];
    if (!token) {
      return res.status(403).json({ message: "User's not authorised" });
    }
    const decodedData = jwt.verify(token, key.secret);
    req.user = decodedData;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "User's not authorised" });
  }
};

export default AuthMiddleware;
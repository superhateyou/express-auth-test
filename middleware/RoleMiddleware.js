import jwt from "jsonwebtoken";
import key from "../config.js";

const RoleMiddleware = (roles) => {
  return function (res, req, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split("")[1];
      if (!token) {
        return res.status(403).json({ message: "User's not authorised" });
      }
      const { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "User's not authorised" });
    }
  };
};

export default RoleMiddleware;

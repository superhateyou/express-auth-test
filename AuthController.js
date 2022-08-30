import User from "./Models/Users.js";
import Role from "./Models/Roles.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import key from "./config.js";

const generateAccessToken = (id, roles) => {
  const data = "pasha";
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, key.secret, { expiresIn: "24h" });
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Error occured", errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });

      if (candidate) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = bcrypt.hashSync(password, 7);
      const userRoles = await Role.findOne({ value: "USER" });

      const user = new User({
        username,
        password: hashedPassword,
        roles: [userRoles.value],
      });

      await user.save();

      return res.json({ message: "Successful registration!" });
    } catch (e) {
      console.log(e);
      res.status(400).json("Registration error");
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Error occured" });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Wrong password" });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json("Login error");
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {}
  }
}

export default new AuthController();

import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    check("email").isEmail().withMessage("Email is required!"),
    check("password")
      .isLength({
        min: 6,
      })
      .withMessage("Password with 6 or more characters required!"),
    check("firstName").isString().withMessage("First name is required!"),
    check("lastName").isString().withMessage("Last name is required!"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      // Tìm user trong database
      let user = await User.findOne({
        email: req.body.email,
      });

      // Kiểm tra user có tồn tại hay không
      if (user) {
        return res.status(400).json({ message: "User already exists" }); // Bad Request
      }

      // Tạo và lưu user mới vào database
      user = new User(req.body);
      await user.save();

      // Tạo token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      // Gửi cookie cho client
      res.cookie("auth_token", token, {
        httpOnly: true, // Cookie không thể truy cập bằng JS trong trình duyệt
        secure: process.env.NODE_ENV === "production", // Cookie chỉ được gửi thông qua HTTPS trong production
        maxAge: 86400000, // Thời gian sống: in miliseconds
      });
      return res.status(200).send({ message: "User registered OK" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

export default router;

import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

// Api lấy thông tin người dùng, không bao gồm password
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    // Lấy thông tin user từ db, không bao gồm password
    const user = await User.findById(userId).select("-password");

    // Nếu không tìm thấy user -> trả về lỗi
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

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

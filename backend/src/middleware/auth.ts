import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Thêm thuộc tính userId vào Express Request
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"]; // Lấy token từ request

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" }); // 401: Unauthorized
  }

  try {
    // Kiểm tra jwt có trùng khớp hay không
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" }); // 401: Unauthorized
  }
};

export default verifyToken;

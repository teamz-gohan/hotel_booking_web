import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() =>
    console.log(
      "Connected to database: ",
      process.env.MONGODB_CONNECTION_STRING
    )
  );

const app = express();

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(cookieParser()); // Dùng để lấy cookie từ request
app.use(express.json()); // Chuyển đổi yêu cầu HTTP có dạng JSON sang Javascript
app.use(express.urlencoded({ extended: true })); // Giải mã yêu cầu HTTP có dạng application/x-www-form-urlencoded thành Javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Chấp nhận request từ URL này
    credentials: true, // Bao gồm credentials
  })
); // Cross-origin: xử lý yêu cầu từ nguồn tài nguyên khác

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(7000, () => {
  console.log("Server is running on localhost:7000");
});

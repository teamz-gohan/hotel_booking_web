import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

// Khởi tạo một đối tượng bộ nhớ RAM
const storage = multer.memoryStorage();

// Cấu hình đối tượng multer để lưu trữ
const upload = multer({
  storage: storage, // Sử dụng bộ nhớ RAM làm nơi lưu trữ
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn tệp tải lên
  },
});

// Api xử lý upload thông tin khách sạn
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required!"),
    body("city").notEmpty().withMessage("City is required!"),
    body("country").notEmpty().withMessage("Country is required!"),
    body("description").notEmpty().withMessage("Description is required!"),
    body("type").notEmpty().withMessage("Hotel type is required!"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number!"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required!"),
  ],
  upload.array("imageFiles", 6), // Xử lý các tệp tải lên và lưu trữ vào RAM
  async (req: Request, res: Response) => {
    try {
      // Lấy các files đã tải lên
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      /* UPLOAD CÁC FILE ẢNH LÊN CLOUDINARY */
      const uploadPromises = imageFiles.map(async (image) => {
        // Mã hóa hình ảnh -> base64
        const base64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + base64; // URI
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      /* THÊM URL VÀO ĐỐI TƯỢNG HOTEL */
      // Gán một vài giá trị cho đối tượng Hotel
      const imageUrls = await Promise.all(uploadPromises);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      /* THÊM HOTEL VÀO DATABASE */
      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel); // 201: Created
    } catch (err) {
      console.log("Error creating hotel: ", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
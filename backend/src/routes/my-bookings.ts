import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

// Api trả về danh sách các phòng đã đặt
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {

    // Tìm khách sạn mà người dùng đã đặt --> Trả về một mảng khách sạn
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    // Trả vê
    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

export default router;
import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

// Api để search hotel -> api/hotels/search
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 }; // Sắp xếp giảm dần
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 }; // Sắp xếp tăng dần
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 }; // Sắp xếp giảm dần
        break;
    }

    const pageSize = 5; // Số lượng khách sạn hiển thị trong 1 trang

    // Trang hiển thị hiện tại
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    // Skip dùng để search trong database -> Giúp hiển thị danh sách khách sạn tại pageNumber
    const skip = (pageNumber - 1) * pageSize;

    // Duyệt danh sách khách sạn trong database
    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // Đếm số lượng Hotel có trong database
    const total = await Hotel.countDocuments(query);

    // Định nghĩa các giá trị trả về
    const response: HotelSearchResponse = {
      data: hotels, // List các hotels
      pagination: {
        total, // Tổng số hotel tìm được
        page: pageNumber, // Page hiển thị hiện tại
        pages: Math.ceil(total / pageSize), // Số lượng page
      },
    };

    res.json(response);
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Api trả về những khách sạn vừa được thêm
router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

// Api để xem chi tiết thông tin khách sạn
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required!")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req); // Validation có lỗi hay không
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ID khách sạn từ request của người dùng
    const id = req.params.id.toString();

    try {
      // Tìm thông tin khách sạn trong db theo id và trả về cho người dùng
      const hotel = await Hotel.findById(id);
      res.json(hotel);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching hotel" });
    }
  }
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
        }
      );

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found!" });
      }

      await hotel.save();
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// Hàm tạo câu truy vấn dữ liệu database
const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;

import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";

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

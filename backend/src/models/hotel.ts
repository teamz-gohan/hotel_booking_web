import mongoose from "mongoose";
import { HotelType } from "../shared/types";

// Cấu trúc và quy tắc dữ liệu của một booking
const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalCost: { type: Number, required: true },
});

// Cấu trúc và quy tắc dữ liệu của hotel
const hotelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  facilities: [{ type: String, required: true }],
  pricePerNight: { type: Number, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: String, required: true },
  bookings: [bookingSchema],
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);

export default Hotel;

import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels
  );

  if (!hotelData) {
    return <span>No Hotels Found</span>;
  }

  return (
    <div className="space-y-8">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-blue-600 items-center rounded-full px-6 py-2 text-white font-bold hover:opacity-80 transition-all duration-200"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel, index) => (
          <div
            key={index}
            className="flex flex-col justify-between p-8 gap-5 border border-slate-100 rounded-[25px] shadow-[0_0_60px_-25px_rgba(0,0,0,0.4)]"
          >
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-md p-3 flex items-center">
                <BsMap className="mr-2" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-md p-3 flex items-center">
                <BsBuilding className="mr-2" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-md p-3 flex items-center">
                <BiMoney className="mr-2" />${hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-md p-3 flex items-center">
                <BiHotel className="mr-2" />
                {`${hotel.adultCount} ${
                  hotel.adultCount > 1 ? "adults" : "adult"
                }, `}
                {`${hotel.childCount} ${
                  hotel.childCount > 1 ? "children" : "child"
                }`}
              </div>
              <div className="border border-slate-300 rounded-md p-3 flex items-center">
                <BiStar className="mr-2" />
                {hotel.starRating}{" "}
                {(hotel.starRating > 1 && "stars rating") || "star rating"}
              </div>
            </div>
            <span className="flex justify-end">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-blue-600 items-center rounded-full px-6 py-2 text-white font-bold hover:opacity-80 transition-all duration-200"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;

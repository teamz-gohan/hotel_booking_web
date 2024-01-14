import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold cursor-pointer">{hotel.name}</h1>
        <div className="flex items-center gap-1">
          <span className="flex">
            {Array.from({ length: hotel.starRating }).map((...args) => (
              <AiFillStar key={args[1]} className="fill-yellow-400" />
            ))}
          </span>
          <span className="ml-1 text-sm">{hotel.type}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((imageUrl, index) => (
          <div key={index} className="h-[300px]">
            <img
              src={imageUrl}
              alt={hotel.name}
              className="rounded-[25px] w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Facilities</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
          {hotel.facilities.map((facility, index) => (
            <div
              key={index}
              className="border border-current rounded-[25px] px-4 py-2 text-[#030303]"
            >
              {facility}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Description</h1>
          <div className="whitespace-pre-line">{hotel.description}</div>
        </div>
        <div className="h-fit space-y-4">
          <h1 className="text-xl font-bold">Booking</h1>
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;

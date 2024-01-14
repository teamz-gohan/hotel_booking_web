import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();

  const [page, setPage] = useState<number>(1);

  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  // Các params truyền vào để search Hotel, lấy từ input người dùng
  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  // Hàm xử lý khi check vào star: checked -> thêm vào mảng; unchecked -> xóa khỏi mảng
  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;
    setSelectedStars((prev) =>
      event.target.checked
        ? [...prev, starRating]
        : prev.filter((star) => star !== starRating)
    );
  };

  // Hàm xử lý khi check vào type: checked -> thêm vào mảng; unchecked -> xóa khỏi mảng
  const handleHotelTypesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelType = event.target.value;
    setSelectedHotelTypes((prev) =>
      event.target.checked
        ? [...prev, hotelType]
        : prev.filter((type) => type !== hotelType)
    );
  };

  // Hàm xử lý khi check vào facilities: checked -> thêm vào mảng; unchecked -> xóa khỏi mảng
  const handleFacilitiesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const facilities = event.target.value;
    setSelectedFacilities((prev) =>
      event.target.checked
        ? [...prev, facilities]
        : prev.filter((facility) => facility !== facilities)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={selectedHotelTypes}
            onChange={handleHotelTypesChange}
          />
          <FacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilitiesChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-start">
          {/* <span className="text-xl font-bold">
            {`${hotelData?.pagination.total} ${
              (hotelData?.pagination.total || 1) > 1 ? "Hotels" : "Hotel"
            } found ${search.destination && "in " + search.destination}`}
          </span> */}
          <div className="flex flex-col gap-2">
            <p>{`${hotelData?.pagination.total} search ${
              (hotelData?.pagination.total || 1) > 1 ? "results" : "result"
            } for`}</p>
            <h1 className="text-black text-2xl font-bold">{`${
              (search.destination && `${search.destination}, `) || ""
            } ${search.checkIn.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
            })}${
              search.checkOut.getDay() - search.checkIn.getDay() >= 1
                ? ` - ${search.checkOut.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`
                : ""
            }, ${
              search.adultCount + search.childCount > 1
                ? `${search.adultCount + search.childCount} guests`
                : `${search.adultCount + search.childCount} guest`
            }`}</h1>
          </div>
          <div className="px-4 py-2 border rounded-full">
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="focus:outline-none"
            >
              <option value="" disabled>
                Sort By
              </option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">
                Price Per Night (low to high)
              </option>
              <option value="pricePerNightDesc">
                Price Per Night (high to low)
              </option>
            </select>
          </div>
        </div>
        {hotelData?.data.map((hotel, index) => (
          <SearchResultsCard key={index} hotel={hotel} />
        ))}
        <div>
          <Pagination
            page={hotelData?.pagination.page || 1}
            pages={hotelData?.pagination.pages || 1}
            onPageChange={(pageNumber) => setPage(pageNumber)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;

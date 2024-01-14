import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import { useNavigate } from "react-router-dom";
import { BiRightArrowAlt } from "react-icons/bi";

const SearchBar = () => {
  const search = useSearchContext();
  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );
    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex bg-white shadow-md rounded-full items-center px-4 py-2 justify-between text-[#030303]"
    >
      <label className="font-bold px-4 border-r-2">
        Location
        <input
          type="text"
          placeholder="Where are you going?"
          className="text-md w-full focus:outline-none placeholder:font-normal font-normal"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </label>

      <label className="font-bold pl-4 border-r-2">
        Check-in
        <div>
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-in Date"
            className="focus:outline-none font-normal"
            wrapperClassName="min-w-full"
          />
        </div>
      </label>
      <label className="font-bold pl-4 border-r-2">
        Check-out
        <div>
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-out Date"
            className="focus:outline-none font-normal"
            wrapperClassName="min-w-full"
          />
        </div>
      </label>
      <div className="font-bold flex-none w-[230px] pl-4">
        Guests
        <div className="grid grid-cols-2 gap-2">
          <label className="flex font-normal">
            {`${adultCount > 1 ? "Adults: " : "Adult: "}`}
            <input
              type="number"
              className="w-full px-1 focus:outline-none font-bold"
              min={1}
              max={20}
              value={adultCount}
              onChange={(event) => setAdultCount(parseInt(event.target.value))}
            />
          </label>
          <label className="flex font-normal">
            {`${childCount > 1 ? "Children: " : "Child: "}`}
            <input
              type="number"
              className="w-full px-1 focus:outline-none font-bold"
              min={0}
              max={20}
              value={childCount}
              onChange={(event) => setChildCount(parseInt(event.target.value))}
            />
          </label>
        </div>
      </div>
      <button className="ml-4 flex flex-none justify-center items-center rounded-full bg-blue-600  text-white text-4xl w-[60px] h-[60px] hover:opacity-80 transition-all duration-200">
        <BiRightArrowAlt />
      </button>
    </form>
  );
};

export default SearchBar;

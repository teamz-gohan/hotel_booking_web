import React, { useContext, useState } from "react";

// Định nghĩa kiểu dữ liệu cho SearchContext
type SearchContext = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  hotelId: string;
  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number
  ) => void;
};

// Định nghĩa kiểu dữ liệu cho props
type SearchContextProviderProps = {
  children: React.ReactNode;
};

// Tạo context
const SearchContext = React.createContext<SearchContext | undefined>(undefined);

// Context Provider dùng để bọc các thành phần con
export const SearchContextProvider = ({
  children,
}: SearchContextProviderProps) => {
  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(new Date());
  const [adultCount, setAdultCount] = useState<number>(1);
  const [childCount, setChildCount] = useState<number>(0);
  const [hotelId, setHotelId] = useState<string>("");

  // Hàm lưu những giá trị dùng để search hotel
  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    hotelId?: string
  ) => {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setAdultCount(adultCount);
    setChildCount(childCount);
    hotelId && setHotelId(hotelId);
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        adultCount,
        childCount,
        hotelId,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook cho việc sử dụng context tại các component khác
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  return context as SearchContext
}

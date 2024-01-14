import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();

  // Sử dụng hook useForm để quản lý form, validate,...
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childCount: search.childCount,
    },
  });

  const checkIn = watch("checkIn"); // Theo dõi giá trị trường checkIn -> ghi vào biến
  const checkOut = watch("checkOut");
  const adultCount = watch("adultCount");
  const childCount = watch("childCount");
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const navigate = useNavigate();
  const location = useLocation();

  // Hàm xử lý Booking khi chưa đăng nhập -> Sign in
  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate("/sign-in", { state: { from: location } }); // Lưu lại URL hiện tại và chuyển hướng đến trang đăng nhập
  };

  // Hàm xử lý Booking khi đã đăng nhập -> Book Now
  const onSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate(`/hotel/${hotelId}/booking`);
  };

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4 rounded-md shadow-md">
      <h3 className="text-md font-bold">${pricePerNight} Per Night</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              className="min-w-full bg-white p-2 focus:outline-none rounded-md"
              wrapperClassName="min-w-full"
              required
            />
          </div>
          <div>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              className="min-w-full bg-white p-2 focus:outline-none rounded-md"
              wrapperClassName="min-w-full"
              required
            />
          </div>
          <div className="flex bg-white px-2 py-1 gap-2 justify-between rounded-md">
            <label className="items-center flex flex-1">
              {`${adultCount > 1 ? "Adults: " : "Adult: "}`}
              <input
                type="number"
                className="w-full p-1 focus:outline-none font-bold"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This is required!",
                  min: {
                    value: 1,
                    message: "There must be at least one adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label className="items-center flex flex-1">
              {`${childCount > 1 ? "Children: " : "Child: "}`}
              <input
                type="number"
                className="w-full p-1 focus:outline-none font-bold"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>
          {isLoggedIn ? (
            <button className="text-xl bg-blue-600 items-center rounded-md px-6 py-2 text-white font-bold hover:opacity-80 transition-all duration-200">
              Book Now
            </button>
          ) : (
            <button className="text-xl bg-blue-600 items-center rounded-md px-6 py-2 text-white font-bold hover:opacity-80 transition-all duration-200">
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;

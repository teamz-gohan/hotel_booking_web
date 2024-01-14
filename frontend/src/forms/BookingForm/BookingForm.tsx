import { useForm } from "react-hook-form";
import { UserType } from "../../../../backend/src/shared/types";
import { useNavigate, useParams } from "react-router-dom";
import { useSearchContext } from "../../contexts/SearchContext";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  currentUser: UserType;
  totalCost: number;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  totalCost: number;
};

const BookingForm = ({ currentUser, totalCost }: Props) => {
  const { hotelId } = useParams();
  const search = useSearchContext();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId as string,
      totalCost,
    },
  });

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Created!", type: "SUCCESS" });
        navigate("/my-bookings")
      },
      onError: () => {
        showToast({ message: "Booking Error!", type: "ERROR" });
      },
    }
  );

  const onSubmit = async (formData: BookingFormData) => {
    bookRoom(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5 ml-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            className="mt-1 border rounded w-full px-3 py-2 text-gray-700 bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            className="mt-1 border rounded w-full px-3 py-2 text-gray-700 bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            type="text"
            className="mt-1 border rounded w-full px-3 py-2 text-gray-700 bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>
        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: ${totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          disabled={isLoading}
          className="flex bg-blue-600 items-center rounded-full px-6 py-2 text-white font-bold hover:opacity-80 transition-all duration-200 disabled:bg-gray-500"
        >
          {isLoading ? "Confirming..." : "Confirm"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;

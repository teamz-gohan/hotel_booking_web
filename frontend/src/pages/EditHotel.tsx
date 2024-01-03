import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();
  const { data: hotel } = useQuery(
    "fetchMyHotelById",
    () => apiClient.fetchMyHotelById(hotelId || ""),
    {
      enabled: !!hotelId, // Chỉ thực hiện fetch khi hotelId có giá trị
    }
  );

  const mutation = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({ message: "Hotel saved successfully!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error saving hotel!", type: "ERROR" });
    },
  });

  // Xử lý việc save -> gọi api update
  const handleSave = (hotelFormData: FormData) => {
    mutation.mutate(hotelFormData);
  };

  return (
    <ManageHotelForm
      hotel={hotel}
      onSave={handleSave}
      isLoading={mutation.isLoading}
    />
  );
};

export default EditHotel;

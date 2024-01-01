import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client"

const AddHotel = () => {
  const { showToast } = useAppContext();
  const mutation = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel saved successfully!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({message: "Error saving hotel!", type: "ERROR"})
    }
  });

  const handleSave = (hotelFormData: FormData) => {
    mutation.mutate(hotelFormData)
  }

  return <ManageHotelForm onSave={handleSave} isLoading={mutation.isLoading}/>;
};

export default AddHotel;

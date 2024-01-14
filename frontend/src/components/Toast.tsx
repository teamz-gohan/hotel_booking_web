import { useEffect } from "react";
import { GoX } from "react-icons/go";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";

// Định nghĩa kiểu dữ liệu cho props của Toast
type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  //Khi render ra toast, sau 5 giây gọi onClose() để đóng toast
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    // Clean function
    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const styles = type === "SUCCESS" ? "border-green-600" : "border-red-600";

  return (
    <div
      className={`${styles} flex items-center justify-between w-[350px] fixed top-4 right-4 z-50 p-4 rounded-md bg-white border-l-8 text-[#030303] max-w-md shadow-[0_0_30px_-10px_rgba(0,0,0,0.3)]`}
    >
      <div className="flex items-center">
        <span className="mr-6">
          {type === "SUCCESS" ? (
            <FaCircleCheck className="text-green-600 text-xl" />
          ) : (
            <IoIosCloseCircle className="text-red-600 text-xl" />
          )}
        </span>
        <div className="flex flex-col justify-start items-start">
          <span className="text-lg font-bold">
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
          </span>
          <span className="text-sm font-normal">{message}</span>
        </div>
      </div>
      <button onClick={onClose} className="pl-2 py-4">
        <GoX />
      </button>
    </div>
  );
};

export default Toast;

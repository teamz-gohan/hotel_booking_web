import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

// Định nghĩa kiểu dữ liệu ToastMessage
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

// Định nghĩa kiểu AppContext
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

// Tạo context với kiểu dữ liệu là AppContext
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Context Provider bọc các thành phần con
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  // Kiểm tra token hợp lệ và người dùng đã đăng nhập hay chưa
  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook useAppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu để gửi form lên server
export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const {
    register, // Đăng ký tên trường trong form
    watch, // Theo dõi giá trị của các trường
    handleSubmit, // Hàm xử lý khi submit form
    formState: { errors }, // Đối tượng chứa lỗi
  } = useForm<RegisterFormData>();

  // Theo dõi, quản lý dữ liệu của hành động register
  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken"); // Reset validate "xóa token"
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1 flex flex-col gap-1">
          First Name
          <input
            type="text"
            className="border rounded w-full p-2 font-normal placeholder:italic"
            placeholder="Mike"
            {...register("firstName", { required: "This field is required!" })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1 flex flex-col gap-1">
          Last Name
          <input
            type="text"
            className="border rounded w-full p-2 font-normal placeholder:italic"
            placeholder="Davies"
            {...register("lastName", { required: "This field is required!" })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1 flex flex-col gap-1">
        Email
        <input
          type="email"
          className="border rounded w-full p-2 font-normal placeholder:italic"
          placeholder="example@gmail.com"
          {...register("email", { required: "This field is required!" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1 flex flex-col gap-1">
        Password
        <input
          type="password"
          className="border rounded w-full p-2 font-normal"
          {...register("password", {
            required: "This field is required!",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters!",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1 flex flex-col gap-1">
        Confirm Password
        <input
          type="password"
          className="border rounded w-full p-2 font-normal"
          {...register("confirmPassword", {
            validate: (value) => {
              if (!value) {
                return "This field is required!";
              } else if (watch("password") !== value) {
                return "Your password does not match!";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="flex bg-blue-600 justify-self-end items-center rounded-full px-6 py-2 text-white font-bold hover:opacity-80 transition-all duration-200"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho Sign In form
export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  // Theo dõi hành động sign in
  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Signed in successfully!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
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
      <h2 className="text-3xl font-bold">Sign In</h2>
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
          className="border rounded w-full p-2 font-normal placeholder:italic"
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
      <span className="flex items-center justify-between">
        <span className="tex-sm">
          Not Registered?{" "}
          <Link className="underline" to="/register">
            Create an account here
          </Link>
        </span>
        <button
          type="submit"
          className="flex bg-blue-600 justify-self-end items-center rounded-full px-6 py-2 text-white font-bold hover:opacity-80 transition-all duration-200"
        >
          Login
        </button>
      </span>
    </form>
  );
};

export default SignIn;

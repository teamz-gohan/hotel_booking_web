import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="py-6">
      <div className="container mx-auto flex items-center">
        <span className="text-2xl text-[#030303] font-bold tracking-tight">
          <Link to="/">HotelBooking</Link>
        </span>
        {isLoggedIn ? (
          <span className="flex ml-12 flex-1 justify-between">
            <div className="flex space-x-4">
              <Link
                className="flex items-center text-[#030303] px-3 font-bold hover:text-blue-600 transition-colors duration-200"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center text-[#030303] px-3 font-bold hover:text-blue-600 transition-colors duration-200"
                to="/my-hotels"
              >
                My Hotels
              </Link>
            </div>
            <SignOutButton />
          </span>
        ) : (
          <span className="flex ml-12 flex-1 justify-end space-x-4">
            <Link
              to="/register"
              className="flex bg-white border-2 border-current justify-self-end items-center rounded-full px-6 py-2 text-blue-600 font-bold hover:bg-blue-100 transition-all duration-200"
            >
              Sign Up
            </Link>
            <Link
              to="/sign-in"
              className="flex bg-blue-600 justify-self-end items-center rounded-full px-6 py-2 text-white font-bold hover:opacity-80 transition-all duration-200"
            >
              Sign In
            </Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default Header;

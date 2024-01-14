import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  hotel: HotelType;
};

const LastestDestinationCard = ({ hotel }: Props) => {
  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-[25px]"
    >
      <div className="h-[300px]">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center hover:brightness-[0.6] transition-all hover:scale-110 duration-200"
        />
      </div>

      <div className="absolute bottom-[12px] left-[12px] px-4 py-2 bg-white bg-opacity-70 rounded-full">
        <span className="text-[#030303] font-bold tracking-tight text-xl">
          {hotel.name}
        </span>
      </div>
    </Link>
  );
};

export default LastestDestinationCard;
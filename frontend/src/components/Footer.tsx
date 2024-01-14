const Footer = () => {
  return (
    <div className="bg-[#f8f8f8] py-10">
      <div className="container mx-auto flex justify-between items-start">
        <span className="text-[#030303] tracking-tight flex gap-2 flex-col">
          <h1 className="font-bold text-3xl">HotelBooking</h1>
          <p className="font-light">
            Your favorite hotel booking experience <br />
            since 2024!
          </p>
        </span>
        <span className="text-[#030303] tracking-tight flex flex-col gap-2 text-right">
          <a className="cursor-pointer font-bold">Help</a>
          <a className="cursor-pointer font-light">FAQ</a>
          <a className="cursor-pointer font-light">Customer service</a>
          <a className="cursor-pointer font-light">How to guide</a>
          <a className="cursor-pointer font-light">Contact us</a>
        </span>
      </div>
    </div>
  );
};

export default Footer;

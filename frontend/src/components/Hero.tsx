const Hero = () => {
  return (
    <div className="flex flex-col gap-2 container mx-auto relative">
      <img
        className="h-[300px] w-full object-cover brightness-50 rounded-[25px]"
        src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div className="space-y-5 w-full text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h1 className="text-5xl text-white font-bold">
          Book your stay with HotelBooking
        </h1>
        <p className="text-2xl text-white">
          Search low prices on hotels for your dream vacation...
        </p>
      </div>
    </div>
  );
};

export default Hero;

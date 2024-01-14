import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative mb-16 z-10">
        <Header />
        <Hero />
        <div className="container mx-auto absolute z-4 bottom-0 translate-y-[50%] w-[86%] translate-x-[-50%] left-[50%]">
          <SearchBar />
        </div>
      </div>
      <div className="container mx-auto py-10 flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;

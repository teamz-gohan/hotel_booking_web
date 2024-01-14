export type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, pages, onPageChange }: Props) => {
  const pageNumbers = []; // Mảng chứa số lượng page, mỗi phần tử là 1 page
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center">
      <ul className="flex items-center gap-4 justify-center">
        {pageNumbers.map((pageNumber, index) => (
          <li
            key={index}
            className={`cursor:pointer ${
              page === pageNumber
                ? "text-white text-center px-2 py-1 h-[30px] w-[30px] rounded-full bg-blue-600"
                : "hover:text-blue-600 transition-all"
            }`}
          >
            <button
              onClick={() => onPageChange(pageNumber)}
              disabled={page === pageNumber}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;

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
      <ul className="flex border border-slate-300">
        {pageNumbers.map((pageNumber, index) => (
          <li
            key={index}
            className={`px-2 py-1 ${page === pageNumber ? "bg-gray-200" : ""}`}
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

import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  const handlePageChange = (page) => {
    if (
      page === "..." ||
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <div
      className={`
        flex flex-wrap items-center justify-between gap-3
        rounded-2xl border border-gray-200
        bg-white px-4 py-3
        shadow-sm
        ${className}
      `}
    >
      <p className="text-sm text-gray-500">
        Page{" "}
        <span className="font-semibold text-gray-900">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900">
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg border border-gray-200
            bg-white text-gray-500
            transition
            hover:bg-gray-50 hover:text-gray-900
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          aria-label="Previous page"
        >
          <ChevronLeft size={17} />
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              className={`
                flex h-9 w-9 items-center justify-center
                rounded-lg text-sm font-medium
                transition
                ${
                  currentPage === page
                    ? "bg-[#0F766E] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg border border-gray-200
            bg-white text-gray-500
            transition
            hover:bg-gray-50 hover:text-gray-900
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          aria-label="Next page"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
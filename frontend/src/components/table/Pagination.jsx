import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

const getPages = () => {
  const pages = [];

  // 7 or fewer pages → show everything
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Always show first page
  pages.push(1);

  // Beginning
  if (currentPage <= 4) {
    pages.push(2, 3, 4, 5);
    pages.push("...");
    pages.push(totalPages);

    return pages;
  }

  // End
  if (currentPage >= totalPages - 3) {
    pages.push("...");
    pages.push(
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1
    );
    pages.push(totalPages);

    return pages;
  }

  // Middle
  pages.push("...");
  pages.push(currentPage - 1);
  pages.push(currentPage);
  pages.push(currentPage + 1);
  pages.push("...");
  pages.push(totalPages);

  return pages;
};

  return (
    <div className="flex items-center justify-between mt-6">

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <div className="flex items-center gap-2">

       {getPages().map((page, index) =>
  page === "..." ? (
    <span
      key={`ellipsis-${index}`}
      className="px-2 text-slate-500"
    >
      ...
    </span>
  ) : (
    <button
      key={`page-${page}-${index}`}
      onClick={() => onPageChange(page)}
      className={`h-10 w-10 rounded-lg text-sm transition ${
        currentPage === page
          ? "bg-[#56BD05] text-white"
          : "border border-slate-200 hover:bg-slate-100"
      }`}
    >
      {page}
    </button>
  )
)}

      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100"
      >
        Next
        <ChevronRight size={18} />
      </button>

    </div>
  );
}
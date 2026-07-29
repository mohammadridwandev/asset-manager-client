type PaginationEmployeeProps = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
};

export default function Pagination_Employee({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: PaginationEmployeeProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // Beginning
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
      return pages;
    }

    // End
    if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );

      return pages;
    }

    // Middle
    pages.push(
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    );

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-8 pb-16 flex flex-wrap items-center justify-center gap-2">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="rounded-md border border-app-gray/20 px-4 py-2 text-sm font-medium transition hover:bg-app-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm font-medium text-app-text/60"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
              currentPage === page
                ? "border-app-brand bg-app-brand text-white"
                : "border-app-gray/20 hover:bg-app-brand hover:text-white"
            }`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="rounded-md border border-app-gray/20 px-4 py-2 text-sm font-medium transition hover:bg-app-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
type LicensePaginationProps = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
};

export default function License_Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: LicensePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
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
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-md border border-app-gray/30 px-4 py-2 text-sm font-medium transition hover:bg-app-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {pageNumbers.map((pageNumber, index) =>
        pageNumber === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm font-medium opacity-60"
          >
            ...
          </span>
        ) : (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(Number(pageNumber))}
            className={`h-10 min-w-10 rounded-md border px-3 text-sm font-semibold transition ${
              currentPage === pageNumber
                ? "border-app-brand bg-app-brand text-white"
                : "border-app-gray/30 hover:bg-app-brand hover:text-white"
            }`}
          >
            {pageNumber}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-md border border-app-gray/30 px-4 py-2 text-sm font-medium transition hover:bg-app-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
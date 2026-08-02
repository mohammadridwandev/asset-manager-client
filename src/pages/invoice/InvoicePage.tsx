import { FiMinus, FiPlus, FiSearch } from "react-icons/fi";
import Upload_Invoice from "../../components/Invoices_Compo/Upload_Invoice";
import { useEffect, useRef, useState } from "react";
import InvoiceCard from "../../components/Invoices_Compo/InvoiceCard";
import { useGetInvoices } from "../../context/useInvoice";
import Invoice_Pagination from "../../components/Invoices_Compo/Invoice_Pagination";
import { Helmet } from "react-helmet-async";
import DataLoading from "../../DataLoading";
import { useDebounce } from "../../context/useDebounce";


export default function InvoicePage() {
  const [showUpload, setShowUpload] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const invoiceListRef = useRef<HTMLDivElement>(null);

  // Search typing শেষ হওয়ার 400ms পরে API request যাবে
  const debouncedSearchText = useDebounce(
    searchText.trim(),
    400,
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetInvoices(
    page,
    10,
    debouncedSearchText,
  );

  const invoices = data?.invoices || [];
  const pagination = data?.pagination;

  // Search value change হলে page 1-এ যাবে
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchText]);

  const handlePageChange = (
    newPage: number,
  ) => {
    setPage(newPage);

    setTimeout(() => {
      invoiceListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // শুধু প্রথমবার data load-এর সময় full loading দেখাবে
  if (isLoading && !data) {
    return (
      <DataLoading
        title="Loading Invoices"
        message="Fetching invoice data..."
      />
    );
  }

  if (isError && !data) {
    return (
      <div className="flex min-h-75 items-center justify-center text-lg font-medium text-red-500">
        Failed to load invoice data!
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>
          Asset Manager | Invoices
        </title>
      </Helmet>

      <div className="py-4 md:py-8">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Invoices Management
            </h1>

            <p className="mt-1 text-sm text-light_Gray opacity-60 dark_Gray">
              View and manage all invoice documents
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() =>
                setShowUpload(
                  (previous) => !previous,
                )
              }
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-app-brand px-5 py-2.5 text-sm font-bold text-app-secondary shadow-md transition-all hover:opacity-90 active:scale-95 md:w-auto"
            >
              {showUpload ? (
                <>
                  <FiMinus size={18} />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <FiPlus size={18} />
                  <span>Upload Invoice</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative w-full lg:mx-0">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <FiSearch
              className="opacity-40"
              size={18}
            />
          </div>

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value,
              )
            }
            placeholder="Search by invoice number..."
            className="w-full rounded-md border border-app-gray/15 bg-app-bg py-3.5 pr-30 pl-12 text-sm text-light_Gray outline-none transition-all placeholder:text-light_Gray/40 focus:border-app-brand dark_Gray"
          />

          {isFetching && !isLoading && (
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-xs font-medium text-app-brand">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-brand/20 border-t-app-brand" />

              <span className="hidden md:inline">
                Searching...
              </span>
            </div>
          )}
        </div>

        {showUpload && (
          <div className="mt-6">
            <Upload_Invoice
              setShowUpload={setShowUpload}
            />
          </div>
        )}
      </div>

      <div
        ref={invoiceListRef}
        className="scroll-mt-24"
      >
        <InvoiceCard
          invoices={invoices}
          totalInvoices={
            pagination?.totalData
          }
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <div className="mt-6">
        <Invoice_Pagination
          currentPage={
            pagination?.currentPage || 1
          }
          totalPages={
            pagination?.totalPages || 1
          }
          hasNextPage={
            pagination?.hasNextPage || false
          }
          hasPreviousPage={
            pagination?.hasPreviousPage ||
            false
          }
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
import { FiMinus, FiPlus, FiSearch } from "react-icons/fi";
import Upload_Invoice from "../../components/Invoices_Compo/Upload_Invoice";
import { useState } from "react";
import InvoiceCard from "../../components/Invoices_Compo/InvoiceCard";
import { useGetInvoices } from "../../context/useInvoice"; // UPDATED

export default function InvoicePage() {
  const [showUpload, setShowUpload] = useState(false);

  // UPDATED: search state
  const [searchText, setSearchText] = useState("");

  // UPDATED: invoice data parent component এ আনলাম
  const { data, isLoading, isError } = useGetInvoices();

  const invoices = Array.isArray(data) ? data : [];

  // UPDATED: search only invoiceNumber
  const filteredInvoices = invoices.filter((invoice: any) => {
    const search = searchText.toLowerCase();

    return invoice.invoiceNumber?.toLowerCase().includes(search);
  });

  return (
    <div>
      <div className="py-4 md:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Invoices Management
            </h1>
            <p className="text-light_Gray dark_Gray opacity-60 text-sm mt-1">
              View and manage all invoice documents
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex w-full md:w-auto items-center justify-center gap-2 px-5 py-2.5 bg-app-brand text-app-secondary rounded-md text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
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
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FiSearch className="opacity-40" size={18} />
          </div>

          {/* UPDATED: controlled search input */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by invoice number"
            className="w-full bg-app-bg border border-app-gray/15 rounded-md py-3.5 pl-12 pr-4 outline-none focus:border-app-brand dark_Brand transition-all text-sm text-light_Gray dark_Gray placeholder:text-light_Gray dark_Gray/40"
          />
        </div>

        <div>
          {showUpload && <Upload_Invoice setShowUpload={setShowUpload} />}
        </div>
      </div>

      {/* UPDATED: filtered data props হিসেবে পাঠানো হলো */}
      <InvoiceCard
        invoices={filteredInvoices}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
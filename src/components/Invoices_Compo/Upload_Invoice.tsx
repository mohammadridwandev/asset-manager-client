import { FiUploadCloud } from "react-icons/fi";
import { useCreateInvoice } from "../../context/useInvoice";


const Upload_Invoice = ({
  setShowUpload,
}: {
  setShowUpload: (show: boolean) => void;
}) => {
  const createInvoice = useCreateInvoice();


  const handlerUpload = (e: any) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);


    // ---------------------------------------------------- ADDED : SEND INVOICE FORM DATA TO API

    createInvoice.mutate(formData, {
      onSuccess: () => {
        form.reset();
        setShowUpload(false);
      },
    });
  };

  

  return (

    <div className="py-6">
      <div className="p-5 bg-app-bg text-app-text border border-app-gray/20 rounded-xl">
        <h2 className="text-lg font-bold mb-4">Upload Invoice</h2>
        <hr className="border-app-gray/10 mb-5" />

        <form onSubmit={handlerUpload} className="space-y-4">
          {/* Invoice Number */}
          <div className="space-y-1">
            <label className="text-[15px] font-medium">
              Invoice Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              name="invoiceNumber"
              placeholder="e.g., INV-001, INV-2026-001"
              className="w-full my-2 px-3 py-2 rounded-lg border border-app-gray/30 bg-transparent focus:outline-none focus:border-app-brand text-sm"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-1">
            <div className="my-2">
              <label className="text-[15px] font-medium">
                Invoice File <span className="text-red-500">*</span>
              </label>
            </div>

            <label className="cursor-pointer bg-app-brand/10 border-2 border-dashed border-app-brand/30 hover:border-app-brand rounded-lg p-5 flex flex-col items-center justify-center  hover:bg-app-brand/3 transition-all">
              <input
                name="invoiceImage"
                type="file"
                required
                className="hidden"
              />
              <FiUploadCloud size={32} className="text-app-brand mb-1 my-2" />

              <span className="text-[15px] font-medium opacity-80">
                Click to upload or drag and drop
              </span>

              <span className="text-[10px] text-app-gray mt-0.5">
                JPG, PNG or PDF (max 100KB)
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2 text-sm font-semibold">
            <button
              type="submit"
              disabled={createInvoice.isPending}
              className="px-6 py-2 rounded-lg bg-app-brand text-white hover:opacity-90"
            >
              {createInvoice.isPending ? "Uploading..." : "Upload Invoice"}
            </button>
            <button
              onClick={() => setShowUpload(false)}
              type="button"
              className="px-6 py-2 rounded-lg border border-app-gray/30 hover:bg-app-gray/5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default Upload_Invoice;

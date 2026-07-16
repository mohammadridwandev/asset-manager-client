import { useState } from "react";
import DatePicker from "react-datepicker";
import { FiX } from "react-icons/fi";

const Add_Project_Data = ({
  setProjectDataOpen,
}: {
  setProjectDataOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const projectData = {
      ...data,
      date: selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : "",
    };

    console.log(projectData);

    form.reset();
    setSelectedDate(new Date());
    setProjectDataOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-ba z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => setProjectDataOpen(false)}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-app-gray/10 bg-app-bg text-app-text shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-app-gray/20 bg-app-bg px-6 py-4">
          <h2 className="text-xl font-bold">Add New Project Data</h2>

          <button
            type="button"
            onClick={() => setProjectDataOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-app-gray/20 hover:bg-app-gray/10"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name *</label>

              <input
                type="text"
                name="projectName"
                required
                placeholder="Project Name"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Type *</label>

              <input
                type="text"
                name="projectType"
                required
                placeholder="Project Type"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reference Number
              </label>

              <input
                type="text"
                name="referenceNumber"
                placeholder="Reference Number"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>

              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                placeholderText="Select Date"
                closeOnScroll
                isClearable
                calendarClassName="animate-fadeIn"
                wrapperClassName="w-full"
                popperPlacement="bottom-start"
                className="my-2 w-full rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 text-app-gray transition-colors focus:border-app-brand focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>

              <select
                name="status"
                className="my-2 w-full cursor-pointer appearance-none rounded-lg border border-app-gray/30 bg-app-bg px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium">Description</label>

            <textarea
              rows={4}
              name="description"
              placeholder="Description..."
              className="my-2 w-full resize-y rounded-lg border border-app-gray/30 bg-transparent px-4 py-2.5 transition-colors focus:border-app-brand focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-4 border-t border-app-gray/20 pt-6">
            <button
              type="button"
              onClick={() => setProjectDataOpen(false)}
              className="rounded-lg border border-app-gray/30 px-8 py-2 font-medium transition-colors hover:bg-app-gray/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-app-brand px-8 py-2 font-medium text-white transition-opacity hover:opacity-90"
            >
              Save Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_Project_Data;
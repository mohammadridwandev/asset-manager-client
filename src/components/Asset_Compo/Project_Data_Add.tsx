import { FiUpload } from "react-icons/fi";

export default function Project_Data_Add() {



    


  return (
    <div>
      <button
        type="button"
        className="flex flex-1 md:flex-none items-center justify-center gap-2 text-white px-4 py-2.5 bg-teal-600 border border-teal-700/10 rounded-md text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiUpload />
        <span>+ New Data</span>
      </button>
    </div>
  );
}

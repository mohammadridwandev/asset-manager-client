import { LuBuilding2 } from "react-icons/lu";


import All_Department from "../../components/Department/All_Department";


export default function Department() {
  return (
    <div className="w-full pt-8 pb-24 ">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-app-brand/10 text-app-brand">
            <LuBuilding2 size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-app-text">
              Department Management
            </h1>

            <p className="mt-1 text-sm text-app-gray">
              Manage departments, department assets,
              allocations and vacation assets.
            </p>
          </div>

        </div>
      </div>

   

      <All_Department></All_Department>

      

   

    </div>
  );
}
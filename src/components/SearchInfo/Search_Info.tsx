import Employee_Info from "./Employee_Info";
import Assigned_Info from "./Assigned_Info";
import Report_Info from "./Report_Info";


interface Props {
  data: any;
}

export default function Search_Info({ data }: Props) {
  return (
    <div className="mt-8 space-y-6">
      {/* UPDATED: Section 1 */}
      <Employee_Info data={data} />

      {/* UPDATED: Section 2 */}
      <Assigned_Info employee={data.employee} />

      {/* UPDATED: Section 3 */}
      <Report_Info reports={data.employee.reports} />

      

    </div>
  );
}
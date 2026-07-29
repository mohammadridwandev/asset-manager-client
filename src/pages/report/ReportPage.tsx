import { Helmet } from "react-helmet-async";
import Allocation_Report from "../../components/Report_Compo/Allocation_Report";
import Report_Information from "../../components/Report_Compo/Clearance_Paper/Report_Information";
import Select_Employee from "../../components/Report_Compo/Clearance_Paper/Select_Employee";
import Clearance_Records from "../../components/Report_Compo/Clearance_Records/Clearance_Records";

import Report_count from "../../components/Report_Compo/Report_count";


export default function ReportPage() {
  return (
    <div className="w-full py-16">


  <Helmet>
    <title>Asset Manager | Reports</title>
  </Helmet>
    
      <div>
        <Report_count />
      </div>

      <div className="grid mt-16 grid-cols-1 items-start lg:grid-cols-2 gap-6">
        <Select_Employee />
        <Report_Information />
      </div>

      <div>
        <Clearance_Records></Clearance_Records>
      </div>

      <div>
        <Allocation_Report />
      </div>

      <div>
        {/* <Employee_Details /> */}
      </div>
    </div>
  );
}

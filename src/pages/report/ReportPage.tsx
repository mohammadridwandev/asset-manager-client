import { Helmet } from "react-helmet-async";
import Allocation_Report from "../../components/Report_Compo/Allocation_Report";

import Select_Employee from "../../components/Report_Compo/Clearance_Paper/Select_Employee";
import Clearance_Records from "../../components/Report_Compo/Clearance_Records/Clearance_Records";





export default function ReportPage() {
  return (
    <div className="w-full py-16">


  <Helmet>
    <title>Asset Manager | Reports</title>
  </Helmet>
    
      <div>
        {/* <Report_count /> */}
      </div>

      <div className="">
        <Select_Employee />
        {/* <Report_Information /> */}
      </div>

      <div>
        <Clearance_Records></Clearance_Records>
      </div>

      <div>
        <Allocation_Report />
      </div>

      
    </div>
  );
}

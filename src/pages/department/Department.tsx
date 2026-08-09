import Add_Department from "../../components/Department/Add_Department";
import Department_Asset from "../../components/Department/Department_Asset";
import Department_Asset_Allocation_Report from "../../components/Department/Department_Asset_Allocation_Report";
import Vacation_Department_Assets from "../../components/Department/Vacation_Department_Assets";


export default function Department() {

  


  return (
    <div className="py-16">
       <Department_Asset_Allocation_Report></Department_Asset_Allocation_Report>
      <Add_Department></Add_Department>
      <Department_Asset></Department_Asset>
      <Vacation_Department_Assets></Vacation_Department_Assets>

    </div>
  )
}

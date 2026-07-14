import User_Management from "../../components/profile_comp/User_Management";

import CreateUser from "../../components/profile_comp/CreateUser";
import Profile from "../../components/profile_comp/Profile";
import { useRole } from "../../context/useAdmin";

export default function Profile_Setting() {
  const { isAdmin } = useRole();

  return (
    <>

    
      <div>
        <Profile></Profile>
      </div>


      {isAdmin && (
        <>
          <div className="pt-4">
            <CreateUser />
          </div>

          <div className="pt-4">
            <User_Management />
          </div>
        </>
      )}



    </>
  );
}

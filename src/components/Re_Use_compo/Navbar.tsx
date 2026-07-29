import { useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

import { IoMdClose } from "react-icons/io";
import {
  LuLayoutDashboard,
  LuUsers,
  LuPackage,
  LuFileText,
  LuSearch,
  LuClipboardList,
  LuLogOut,
} from "react-icons/lu";
import { TbLicense } from "react-icons/tb";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthProvider";
import toast from "react-hot-toast";
import { useRole, type Role } from "../../context/useAdmin";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user, loading } = useAuth();
  const navigate = useNavigate();

  const { darkMode, toggleDarkMode } = useTheme();


const { hasRole } = useRole();



 const navItems: {
  name: string;
  icon: React.ReactNode;
  href: string;
  roles: Role[];
}[] = [
  {
    name: "Dashboard",
    icon: <LuLayoutDashboard size={18} />,
    href: "/dashboard",
    roles: ["ADMIN", "IT", "FINANCE", "GUEST"],
  },
  {
    name: "Employees",
    icon: <LuUsers size={18} />,
    href: "/dashboard/employees",
    roles: ["ADMIN"],
  },
  {
    name: "Assets",
    icon: <LuPackage size={18} />,
    href: "/dashboard/assets",
    roles: ["ADMIN"],
  },
  {
    name: "Licenses",
    icon: <TbLicense size={18} />,
    href: "/dashboard/licenses",
    roles: ["ADMIN"],
  },
  {
    name: "Invoices",
    icon: <LuFileText size={18} />,
    href: "/dashboard/invoices",
    roles: ["ADMIN", "FINANCE"],
  },
  {
    name: "Search",
    icon: <LuSearch size={18} />,
    href: "/dashboard/search",
    roles: ["ADMIN", "IT", "FINANCE"],
  },
  {
    name: "Reports",
    icon: <LuClipboardList size={18} />,
    href: "/dashboard/reports",
    roles: ["ADMIN"],
  },
];


const allowedNavItems = navItems.filter((item) =>
  hasRole(item.roles),
);

  const [profileOpen, setProfileOpen] = useState(false);

  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlerLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="fixed w-full  z-50 bg-app-bg  border border-app-gray/15 ">
      
      <nav className="container px-4 m-auto  py-4  flex items-center justify-between relative ">
        {/* Logo Section */}

        <Link to={"/dashboard"} className="flex items-center gap-2">
          <div className="bg-app-brand text-app-secondary p-1.5 rounded-md">
            <LuPackage size={18} />
          </div>
          <span className="font-bold lg:text-xl ">Asset-Manager</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center bg-app-bg  rounded-full  py-1.5 gap-1">


    
          {allowedNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={({
                isActive,
              }) => `flex items-center hover:text-app-brand gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all
                ${isActive ? "text-app-brand font-bold border border-app-brand/10 bg-app-brand/10" : ""}
              `}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}


        </div>

        <div className="flex items-center  gap-3">
          {/* profile section */}
          <div ref={dropDownRef} className="">
            {/* Profile Section */}
            <div className="md:flex  items-center gap-3 text-app-text lg:pl-4 lg:border-l-app-gray/15">
              <div className="">
                


                <button
  onClick={() => setProfileOpen(!profileOpen)}
  className="w-10 h-10 overflow-hidden rounded-full bg-app-brand/20 border border-app-brand/20 flex items-center justify-center hover:bg-app-brand/30 transition-all cursor-pointer"
>
  {user?.image ? (
    <img
      src={`${import.meta.env.VITE_BACKEND_URL_LINK}${user.image}`}
      alt={user.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <LuUsers size={20} className="text-app-brand" />
  )}
</button>




                {profileOpen && (
                  <div className="absolute  border right-5 mt-4 lg:mt-4 w-52 bg-app-bg  border-app-gray/15 rounded-lg shadow-lg z-80 py-2">
                    {/* User Info Section */}

                    <div className="px-4 py-2  border-b border-app-gray/15">
                      <p className="text-sm capitalize font-semibold ">
                        {loading ? "Loading..." : `${user?.name || "Guest"}`}
                      </p>
                      <p className="text-[11px] text-app-gray ">
                        {" "}
                        {loading
                          ? "Loading..."
                          : `${user?.role || "Guest user"}`}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col mt-1">
                      <Link
                        to={"/dashboard/profile-setting"}
                        className="px-4 py-2 text-left  text-sm  border-b border-app-gray/15 hover:bg-app-brand hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <LuUsers size={16} className="mb-1" />
                        Profile Settings
                      </Link>

                    

                      <button
                        onClick={toggleDarkMode}
                        className="w-full px-4 py-2 hover:bg-app-brand hover:text-white text-left text-sm   flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <LuPackage className="mb-1" size={16} />
                          <span>
                            {darkMode ? "Switch to light" : "Switch to Dark"}
                          </span>
                        </div>
                      </button>

                      <div className="h-px border-b border-app-gray/15 my-1 mx-2" />

                      <button
                        onClick={handlerLogout}
                        className="px-4 py-2 text-left text-sm text-app-brand hover:text-app-secondary hover:bg-app-brand  flex items-center gap-2 transition-colors font-medium"
                      >
                        <LuLogOut size={14} className="mb-1" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2  bg-transparent border-0 cursor-pointer"
          >
            {menuOpen ? <IoMdClose size={25} /> : <AiOutlineMenu size={25} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-app-bg dark_Bg_colors border-t-app-gray/15 flex flex-col p-4 gap-2 md:hidden z-50 shadow-md">
            {allowedNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3   transition-colors ${isActive ? "text-app-brand dark_Brand" : " /60 "}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

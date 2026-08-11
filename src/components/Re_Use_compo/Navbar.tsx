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
  LuChevronDown,
} from "react-icons/lu";

import { TbLicense } from "react-icons/tb";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthProvider";

import toast from "react-hot-toast";

import { useRole, type Role } from "../../context/useAdmin";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  // SUBMENU STATE
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const { logout, user, loading } = useAuth();

  const navigate = useNavigate();

  const { darkMode, toggleDarkMode } = useTheme();

  const { hasRole } = useRole();

  const dropDownRef = useRef<HTMLDivElement | null>(null);

  const subMenuRef = useRef<HTMLDivElement | null>(null);

  // =========================
  // MAIN NAV ITEMS
  // =========================

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
      name: "Search",
      icon: <LuSearch size={18} />,
      href: "/dashboard/search",
      roles: ["ADMIN", "FINANCE"],
    },

    {
      name: "Department",
      icon: <LuClipboardList size={18} />,
      href: "/dashboard/department",
      roles: ["ADMIN"],
    },
    
  ];

  // =========================
  // SUBMENU ITEMS
  // =========================

  const subMenuItems: {
    name: string;
    icon: React.ReactNode;
    href: string;
    roles: Role[];
  }[] = [
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
      name: "Reports",
      icon: <LuClipboardList size={18} />,
      href: "/dashboard/reports",
      roles: ["ADMIN"],
    },

    {
      name: "Vacation Records",
      icon: <LuClipboardList size={18} />,
      href: "/dashboard/employee-vacation",
      roles: ["ADMIN"],
    },
    



  ];

  const allowedNavItems = navItems.filter((item) => hasRole(item.roles));

  const allowedSubMenuItems = subMenuItems.filter((item) =>
    hasRole(item.roles),
  );

  // =========================
  // CLICK OUTSIDE
  // =========================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropDownRef.current && !dropDownRef.current.contains(target)) {
        setProfileOpen(false);
      }

      if (subMenuRef.current && !subMenuRef.current.contains(target)) {
        setSubMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handlerLogout = () => {
    logout();

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // =========================
  // NAV CLICK
  // =========================

  const handleNavClick = () => {
    setMenuOpen(false);
    setSubMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="bg-app-bg dark_Bg_colors border-b border-app-gray/15 sticky top-0 z-50">

      <nav className="container px-4 m-auto py-4 flex items-center justify-between relative">
        {/* =========================
            LOGO SECTION
        ========================= */}

        <Link to={"/dashboard"} className="flex items-center gap-2">
          <div className="bg-app-brand text-app-secondary p-1.5 rounded-md">
            <LuPackage size={18} />
          </div>

          <span className="font-bold lg:text-lg">Asset-Manager</span>
        </Link>

        {/* =========================
            DESKTOP MENU
        ========================= */}

        <div className="hidden lg:flex items-center bg-app-bg rounded-full py-1.5 gap-1">
          {allowedNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center hover:text-app-brand gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "text-app-brand font-bold border border-app-brand/10 bg-app-brand/10"
                    : ""
                }`
              }
            >
              {item.icon}

              {item.name}
            </NavLink>
          ))}

          {/* =========================
              MORE SUBMENU
          ========================= */}

          {allowedSubMenuItems.length > 0 && (
            <div ref={subMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setSubMenuOpen(!subMenuOpen)}
                className="flex items-center  hover:text-app-brand gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer"
              >
                <LuClipboardList size={18} />
                More
                <LuChevronDown
                  size={14}
                  className={`transition-transform ${
                    subMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {subMenuOpen && (
                <div className="absolute  top-full left-0 mt-3 w-48 bg-app-bg border border-app-gray/15 rounded-lg shadow-lg z-80 py-2">
                  {allowedSubMenuItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? "text-app-brand  bg-app-brand/10 font-semibold"
                            : "hover:bg-app-brand/5 hover:text-app-brand"
                        }`
                      }
                    >
                      {item.icon}

                      <span>{item.name}</span>

                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )}


        </div>

        {/* =========================
            RIGHT SECTION
        ========================= */}

        <div className="flex items-center gap-3">
          {/* PROFILE */}

          <div ref={dropDownRef} className="">
            <div className="md:flex items-center gap-3 text-app-text lg:pl-4 lg:border-l-app-gray/15">
              <div className="">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 overflow-hidden rounded-full bg-app-brand/20 border border-app-brand/20 flex items-center justify-center hover:bg-app-brand/30 transition-all cursor-pointer"
                >
                  {user?.image ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL_LINK}${user.image}`}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <LuUsers size={20} className="text-app-brand" />
                  )}
                </button>

                {/* =========================
                    PROFILE DROPDOWN
                ========================= */}

                {profileOpen && (
                  <div className="absolute border right-5 mt-4 lg:mt-4 w-52 bg-app-bg border-app-gray/15 rounded-lg shadow-lg z-80 py-2">
                    {/* USER INFO */}

                    <div className="px-4 py-2 border-b border-app-gray/15">
                      <p className="text-sm capitalize font-semibold">
                        {loading ? "Loading..." : `${user?.name || "Guest"}`}
                      </p>

                      <p className="text-[11px] text-app-gray">
                        {loading
                          ? "Loading..."
                          : `${user?.role || "Guest user"}`}
                      </p>
                    </div>

                    {/* MENU ITEMS */}

                    <div className="flex flex-col mt-1">
                      <Link
                        to={"/dashboard/profile-setting"}
                        className="px-4 py-2 text-left text-sm border-b border-app-gray/15 hover:bg-app-brand hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <LuUsers size={16} className="mb-1" />
                        Profile Settings
                      </Link>

                      <button
                        onClick={toggleDarkMode}
                        className="w-full px-4 py-2 hover:bg-app-brand hover:text-white text-left text-sm flex items-center justify-between transition-colors"
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
                        className="px-4 py-2 text-left text-sm text-app-brand hover:text-app-secondary hover:bg-app-brand flex items-center gap-2 transition-colors font-medium"
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

          {/* =========================
              MOBILE MENU BUTTON
          ========================= */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 bg-transparent border-0 cursor-pointer"
          >
            {menuOpen ? <IoMdClose size={25} /> : <AiOutlineMenu size={25} />}
          </button>
        </div>

        {/* =========================
            MOBILE DROPDOWN
        ========================= */}

        {menuOpen && (
          <div className="absolute top-full  left-0 w-full bg-app-bg dark_Bg_colors border-t-app-gray/15 flex flex-col p-4 gap-2 lg:hidden z-50 shadow-md">
            {/* MAIN ITEMS */}

            {allowedNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive ? "text-app-brand dark_Brand" : "/60"
                  }`
                }
              >
                {item.icon}

                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}

            {/* =========================
                MOBILE MORE
            ========================= */}

            {allowedSubMenuItems.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setSubMenuOpen(!subMenuOpen)}
                  className="flex items-center justify-between px-4 py-3 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <LuClipboardList size={18} />

                    <span className="font-medium">More</span>
                  </div>

                  <LuChevronDown
                    size={16}
                    className={`transition-transform ${
                      subMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {subMenuOpen && (
                  <div className="flex flex-col ml-6 border-l border-app-gray/15">
                    {allowedSubMenuItems.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                            isActive ? "text-app-brand dark_Brand" : "/60"
                          }`
                        }
                      >
                        {item.icon}

                        <span className="font-medium">{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

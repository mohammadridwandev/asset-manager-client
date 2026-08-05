import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";
import AssetPage from "../pages/assets/AssetPage";
import EmployeesPage from "../pages/employees/EmployeesPage";
import LicensePage from "../pages/licenses/LicensePage";
import ReportPage from "../pages/report/ReportPage";
import SearchPage from "../pages/search/SearchPage";
import Not_Found from "../pages/not_Found/Not_Found";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/Layout/MainLayout";
import InvoicePage from "../pages/invoice/InvoicePage";
import Profile_Setting from "../pages/profile/Profile_Setting";

import Update_Employee from "../components/Employee_comp/Update_Employee";
import Asset_Update from "../components/Asset_Compo/Asset_Update";
import Licenses_Update from "../components/Licenses_Compo/Licenses_Update";
import Invoice_Update from "../components/Invoices_Compo/Invoice_Update";
import Printer_Page from "../components/Invoices_Compo/Printer_Page";
import RoleRoute from "./RoleRoute";
import Department from "../pages/department/Department";
import Depart_asset_list from "../components/Department/Depart_asset_list";


const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Login></Login>,
    },

    {
      path: "/login",
      element: <Login></Login>,
    },

    {
      path: "/register",
      element: <Register></Register>,
    },

    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <MainLayout></MainLayout>
        </ProtectedRoute>
      ),

      children: [
        {
          index: true,
          element: (
            <RoleRoute roles={["ADMIN", "IT", "FINANCE", "GUEST"]}>
              <Dashboard></Dashboard>
            </RoleRoute>
          ),
        },

        {
          path: "assets",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <AssetPage />
            </RoleRoute>
          ),
        },

        {
          path: "assets/update/:id",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <Asset_Update />
            </RoleRoute>
          ),
        },

        {
          path: "employees",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <EmployeesPage />
            </RoleRoute>
          ),
        },

        {
          path: "employees/update/:id",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <Update_Employee />
            </RoleRoute>
          ),
        },

        {
          path: "licenses",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <LicensePage />
            </RoleRoute>
          ),
        },

        {
          path: "licenses/update/:id",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <Licenses_Update />
            </RoleRoute>
          ),
        },

        {
          path: "invoices",
          element: (
            <RoleRoute roles={["ADMIN", "FINANCE"]}>
              <InvoicePage />
            </RoleRoute>
          ),
        },

        {
          path: "invoices/update/:id",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <Invoice_Update />
            </RoleRoute>
          ),
        },

        {
          path: "invoices/print/:id",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <Printer_Page />
            </RoleRoute>
          ),
        },

        {
          path: "reports",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <ReportPage />
            </RoleRoute>
          ),
        },

        {
          path: "department",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <Department />
            </RoleRoute>
          ),
        },

        {
          path: "department/:departmentId/assets",
          element: (
            <RoleRoute roles={["ADMIN"]}>
              <Depart_asset_list />
            </RoleRoute>
          ),
        },

        {
          path: "search",
          element: (
            <RoleRoute roles={["ADMIN", "FINANCE"]}>
              <SearchPage />
            </RoleRoute>
          ),
        },

        {
          path: "profile-setting",
          element: (
            <RoleRoute roles={["ADMIN", "IT", "FINANCE"]}>
              <Profile_Setting />
            </RoleRoute>
          ),
        },
      ],
    },

    {
      path: "*",
      element: <Not_Found />,
    },
  ],

  {
    basename: "/asset-manager",
  },
);

export default router;

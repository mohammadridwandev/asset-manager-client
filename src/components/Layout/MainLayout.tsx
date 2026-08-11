import { Outlet } from "react-router-dom";
import Navbar from "../Re_Use_compo/Navbar";

export default function MainLayout() {
  return (
    <div className="">
      <Navbar></Navbar>

      <main className="container  m-auto px-4">
        <Outlet></Outlet>
      </main>
    </div>
  );
}

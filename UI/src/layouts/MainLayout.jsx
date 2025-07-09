import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <>
      <header className="overflow-hidden">
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;

// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Dynamic Responsive Navbar */}
      <Navbar />

      {/* Primary Page Layout Viewport Injector */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Application Footer */}
      <Footer />
    </div>
  );
}

export default MainLayout;
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/davvlogo.png";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Navbar Top */}
      <nav className="fixed bg-[#001845] text-[#979dac] px-6 py-3 shadow-md w-full z-20">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo + Title */}
          <div className="flex items-center space-x-4">
            <img src={logo} alt="it logo" className="h-14 w-14" />
            <Link to="/" className="text-lg font-bold">
              Institute of Engineering & Technology DAVV
            </Link>
          </div>

          {/* Hamburger Button: shows only on small screens */}
          <button
            className="md:hidden flex flex-col space-y-1"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Menu"
          >
            <span className="block w-6 h-0.5 bg-[#979dac]"></span>
            <span className="block w-6 h-0.5 bg-[#979dac]"></span>
            <span className="block w-6 h-0.5 bg-[#979dac]"></span>
          </button>

          {/* Navigation Links: hide on small screens */}
          <div className="hidden md:flex items-center space-x-8 text-md">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/about" className="hover:underline">About</Link>
            <div className="flex items-center space-x-1">
              <Link to="/login" className="hover:underline">Login</Link>
              <span>/</span>
              <Link to="/register" className="hover:underline">Register</Link>
            </div>
            {/* <Link to="/curriculum" className="hover:underline">Curriculum</Link> */}
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/admin/login" className="hover:underline">Upload File</Link>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay (only for mobile, shows when sidebarOpen) */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-40 transition-opacity duration-200 ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#001845] shadow-lg z-40 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col p-6 space-y-5">
          <div className="flex items-center justify-between mb-4">
            <img src={logo} alt="it logo" className="h-10 w-10" />
            <button
              className="text-[#979dac] text-2xl"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close Menu"
            >
              &times;
            </button>
          </div>
          <Link to="/" className="hover:underline" onClick={() => setSidebarOpen(false)}>Home</Link>
          <Link to="/about" className="hover:underline" onClick={() => setSidebarOpen(false)}>About</Link>
          <Link to="/login" className="hover:underline" onClick={() => setSidebarOpen(false)}>Login</Link>
          <Link to="/register" className="hover:underline" onClick={() => setSidebarOpen(false)}>Register</Link>
          <Link to="/curriculum" className="hover:underline" onClick={() => setSidebarOpen(false)}>Curriculum</Link>
          <Link to="/contact" className="hover:underline" onClick={() => setSidebarOpen(false)}>Contact</Link>
          <Link to="/admin/login" className="hover:underline" onClick={() => setSidebarOpen(false)}>Upload File</Link>
        </div>
      </aside>
    </>
  );
};

export default Navbar;

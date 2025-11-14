import { Link } from "react-router-dom";
import logo from "../assets/images/davvlogo.png";
import About from "./About";
const Navbar = () => {
  return (
    <nav className=" fixed bg-[#001845] text-[#979dac] px-6 py-3 shadow-md w-full">
      <div className="container mx-auto flex ml-[10px] justify-between items-center">
        <div className="flex flex-row items-center ml-[10px]">
          <img src={logo} alt="it logo" className="h-15 w-15 mr-4" />
        <Link to="/" className="text-l font-bold">
         Institute of Engineering & Technology DAVV
        </Link>
        </div>

     
        <div className="space-x-10">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
         
          <Link to="/register" className="hover:underline">
            Register
          </Link>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/curriculum" className="hover:underline">
            Curriculum
          </Link>
          
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
           <Link to="/upload" className="hover:underline">
            Upload File
          </Link>


        </div>
      </div>
    </nav>
  );
};

export default Navbar;

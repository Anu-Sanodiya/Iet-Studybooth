import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import {Outlet} from 'react-router-dom';
import clgimg from './assets/images/iet.avif'
import StudyMaterials from "./components/StudyMaterials";
import Curriculum from './components/Curriculum'
import Contact from "./components/contact";
import About from "./components/About";
// import Upload from "./components/upload";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen relative">
      {/* Background image */}
      <div
      className="absolute inset-0 bg-cover bg-center filter opacity-[.9] blur-md  z-0"
      style={{ backgroundImage: `url(${clgimg})` }}
    ></div>

    {/* Fixed Navbar */}
    <div className="fixed top-0 left-0 w-full z-40">
      <Navbar />
    </div>

    {/* Main content */}
    <main className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center text-[#001219] pt-20 px-4">
      {/* pt-20 adds padding to avoid content being hidden behind fixed navbar */}
      <h1 className="text-5xl font-bold">
        Welcome to Institute of Engineering and Technology
      </h1>
      <h2 className="text-3xl font-bold mt-2">
        Devi Ahilya University, Indore(M.P)
      </h2>
    <div className="text-blue-900 font-bold mt-6 space-x-4 text-2xl">
      <div className="inline-block border border-black-400 pl-4 p-4">
        <button onClick={() => navigate("/curriculum")}> 📚 Curriculum</button>
      </div>
      <div className="inline-block border border-black-400 pl-4 p-4">
        <button onClick={() => navigate("/materials")}> 📘Study Materials</button>
      </div>

    </div>
   
      <Outlet />
    </main>
   
  </div>
  )
};




function App() {
  return (
    <Routes>
   
     
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/materials" element={<StudyMaterials />} />
<Route path="/curriculum" element={<Curriculum />} />

<Route path="/contact" element={<Contact />} />

      </Routes>
   
    
  );
}

export default App;



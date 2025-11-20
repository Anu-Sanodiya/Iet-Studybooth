import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { Outlet } from 'react-router-dom';
import clgimg from './assets/images/iet.avif'
import StudyMaterials from "./components/StudyMaterials";
// import Curriculum from './components/Curriculum'
import Contact from "./components/contact";
import About from "./components/About";
import Upload from "./components/upload";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { toast } from 'react-toastify';
import FacultyPage from "./components/faculty";
import Footer from "./components/footer";
import AdminRegister from "./components/AdminRegister";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

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
       <h1 className="text-2xl md:text-5xl font-bold">
  Welcome to Institute of Engineering & Technology
</h1>
<h2 className="text-lg md:text-3xl font-bold mt-2">
  Devi Ahilya University, Indore(M.P)
</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
  {/* <div className="border border-black-400 pl-4 p-4 w-full md:w-auto">
    <button className="w-full md:w-auto" onClick={() => navigate("/curriculum")}> 📚 Curriculum</button>
  </div> */}
  <div className="border border-black-400 pl-4 p-4 w-full md:w-auto">
    <button className="w-full md:w-auto" onClick={() => navigate("/materials")}> 📘Study Materials</button>
  </div>
</div>


        <Outlet />
        {/* Bottom-fixed logout button shown only when logged in */}
        {user && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
            <button
              onClick={async () => {
                try {
                  await logout();
                  toast.success('Logged out');
                  navigate('/');
                } catch (err) {
                  toast.error('Logout failed');
                }
              }}
              className="bg-red-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
            >
              🔒 Logout
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
};





// -------------------- LAYOUT WITH ALWAYS VISIBLE NAVBAR --------------------
const Layout = () => (
  <div className="w-full min-h-screen relative">

    {/* FIXED NAVBAR (Visible on all pages inside Layout) */}
    <div className="fixed top-0 left-0 w-full z-40">
      <Navbar />
    </div>

    {/* Ensures content is pushed below fixed navbar */}
    <main className="relative z-20 pt-20">
      <Outlet />
    </main>

    {/* <Footer /> */}
  </div>
);
function App() {
  return (
    <>
      <Routes>
   
    

        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="materials" element={<StudyMaterials />} />
          {/* <Route path="curriculum" element={<Curriculum />} /> */}
          <Route path="contact" element={<Contact />} />
          <Route path="faculties" element={<FacultyPage />} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} /> 
          {/* Protected Routes (Inside Layout) */}
          <Route 
            path="upload" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Upload />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Fallback Route (Optional: 404 Page) */}
        <Route path="*" element={<div className="text-center mt-10">404 Not Found</div>} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>


  );
}

export default App;



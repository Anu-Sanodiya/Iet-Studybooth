import { useState, useContext } from "react";
// 1. Import useLocation
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { User, Lock, ArrowRight } from "lucide-react";

import professorimage from "../assets/images/OJXK920.jpg";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
 const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 2. Initialize location hook
  const location = useLocation(); 

  // 3. Determine where to go. If 'from' exists, go there. If not, go to Admin Dashboard.
  const from = location.state?.from?.pathname || "/upload";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Both fields are required");
      return;
    }
    setError("");
setIsLoading(true);
    try {
      const data = await adminLogin(formData);
      toast.success("🎉 Admin access granted!");

      // 4. Navigate to the original destination or /upload after successful login
      navigate(from, { replace: true }); 
      
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
    }finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans text-slate-800">
      {/* LEFT SECTION: Image/Branding */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden bg-blue-900 items-center justify-center">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 text-center text-white p-12 max-w-lg">
          <div className="mb-6 inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-xl">
             <User size={48} className="text-blue-200" />
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Admin Portal</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Secure access for faculty and administration. Manage curriculum, student records, and study materials efficiently.
          </p>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* RIGHT SECTION: Login Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-8">
        <div className="w-full max-w-md">
          
          {/* Mobile Header */}
          <div className="md:hidden text-center mb-10">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4 shadow-lg">
                <span className="font-bold text-xl">IET</span>
             </div>
             <h2 className="text-3xl font-bold text-slate-800">Admin Login</h2>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] p-8 md:p-10 border border-white/50">
            
            <div className="mb-8 text-center md:text-left">
              <h2 className="hidden md:block text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500">Please enter your details to sign in.</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r mb-6 text-sm flex items-center animate-pulse">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-slate-800 placeholder-slate-400"
                    placeholder="admin@iet.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-slate-800 placeholder-slate-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-slate-600 cursor-pointer">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out" />
                  <span className="ml-2">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-600/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                ) : (
                   <>
                     Sign In <ArrowRight size={18} className="ml-2" />
                   </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm mt-8 text-slate-500">
            New Administrator?{" "}
            <Link to="/admin/register" className="text-blue-600 font-bold hover:underline">
              Request Access
            </Link>
          </p>
          
          <div className="mt-8 text-center">
             <p className="text-xs text-slate-400">Demo Credentials: admin@iet.edu / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminLogin;
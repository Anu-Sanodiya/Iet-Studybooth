import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";
import professorimage from "../assets/images/OJXK920.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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

    try {
      const data = await loginUser(formData);
      login(data);
      toast.success("🎉 Login successful! Welcome!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
      {/* LEFT IMAGE SECTION */}
      <div className="hidden md:flex w-1/2 justify-center items-center bg-blue-50 relative ">
        <img
          src={professorimage}
          alt="Professor"
          className="h-[70vh] w-auto rounded-2xl shadow-2xl object-covermr-[-40px] z-10"
        />
      </div>
      {/* RIGHT LOGIN FORM SECTION */}
      <div className="flex w-full md:w-1/2 justify-center items-center">
        <div className="bg-white rounded-2xl shadow-2xl px-10 py-12 w-full max-w-lg">
          <div className="flex justify-center mb-8">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#2563eb" />
              <text x="50%" y="57%" textAnchor="middle" fontSize="20" fill="#fff" fontWeight="bold" dy=".3em">IET</text>
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800">Admin Login</h2>
          {error && <p className="text-red-500 text-md mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2 text-blue-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-blue-700" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 font-bold text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={!formData.email || !formData.password}
            >
              Login
            </button>
          </form>
          <p className="text-center text-md mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link to="/admin" className="text-blue-700 hover:underline font-bold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

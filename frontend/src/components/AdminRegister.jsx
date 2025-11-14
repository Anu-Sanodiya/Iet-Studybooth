import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- Added
import professorimage from "../assets/images/OJXK920.jpg";

function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- Validation ---
    if (!name || !email || !password || !department) {
      setError('All fields are required.');
      return;
    }

    if (!email.endsWith('.edu.in')) {
      setError('Email must end with the domain .edu.in');
      return;
    }

    // --- Submission (placeholder) ---
    console.log('Registering admin:', { name, email, department });
    // TODO: Send this data to your backend API

    setSuccess('Admin registered successfully!');
    setName('');
    setEmail('');
    setPassword('');
    setDepartment('');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
      {/* Left image: hidden on small screens */}
      <div className="hidden md:flex w-1/2 justify-center items-center bg-blue-50 relative">
        <img
          src={professorimage}
          alt="Professor"
          className="h-[70vh] w-auto rounded-2xl shadow-2xl object-cover mr-[-40px] z-10"
        />
      </div>

      {/* Right: form */}
      <div className="flex w-full md:w-1/2 justify-center items-center">
        <div className="bg-white rounded-2xl shadow-2xl px-10 py-12 w-full max-w-lg">
          <div className="flex justify-center mb-8">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40" aria-hidden>
              <circle cx="20" cy="20" r="20" fill="#2563eb" />
              <text
                x="50%"
                y="57%"
                textAnchor="middle"
                fontSize="20"
                fill="#fff"
                fontWeight="700"
                dy=".3em"
              >
                IET
              </text>
            </svg>
          </div>

          <h2 className="text-4xl font-extrabold mb-4 text-center text-blue-800">Admin Register</h2>

          {/* Messages */}
          {error && (
            <p className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-center text-sm text-red-700">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-4 rounded-md border border-green-300 bg-green-100 p-3 text-center text-sm text-green-700">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Doe"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@university.edu.in"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                minLength={8}
              />
            </div>

            {/* Department Field */}
            <div className="mb-6">
              <label htmlFor="department" className="mb-2 block text-sm font-medium text-gray-700">
                Department Name
              </label>
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Computer Science"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register Admin
            </button>
          </form>

          <p className="text-center text-md mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/adminlogin" className="text-blue-700 hover:underline font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;

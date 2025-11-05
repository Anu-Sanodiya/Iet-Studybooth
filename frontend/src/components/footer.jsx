import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  // Simulate the visitor counter style from the image
 

  return (
    <footer className="relative z-20 bg-[#001219] text-gray-200 py-6 mt-12 border-t border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Left Section: Copyright and Contact */}
        <div className="text-sm">
          <p>© 2024 IET DAVV. All Rights Reserved.</p>
          <p>Website managed by IET-DAVV web development team.</p>
          <p className="mt-2">
            For any queries contact at: 
            <a href="mailto:webmaster@ietdavv.edu.in" className="font-semibold hover:underline ml-1">
              webmaster@ietdavv.edu.in
            </a>
          </p>
        </div>

        {/* Middle Section: Visitor Counter & Faculty Link */}
        <div className="flex flex-col items-center">
          {/* Faculty Link */}
          <Link 
            to="/faculties" // You can change this route to whatever you set up in App.jsx
            className="mb-4 bg-white text-[#800000] font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            Know Our Faculties
          </Link>

         
        </div>

        {/* Right Section: Social Media Links */}
        <div className="flex justify-center md:justify-end space-x-5">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
            <Facebook size={24} />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
            <Twitter size={24} />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
            <Youtube size={24} />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
            <Linkedin size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
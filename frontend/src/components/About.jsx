const About = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto bg-[#ade8f4]">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4 text-center">About Our  Portal</h1>

      {/* Description */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        This platform is designed to help newly admitted students easily access 
        curriculum information, study materials, and resources relevant to their courses. 
        It serves as a centralized hub to provide academic support and seamless navigation 
        for students pursuing their educational journey at our college.
      </p>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
        
        <div className="p-6 border rounded-lg shadow-sm  bg-[#48cae4]">
          <h2 className="text-xl font-semibold mb-2">🎯 Our Mission</h2>
          <p className="text-gray-600">
            To provide students with a reliable and user-friendly platform where they 
            can easily find academic materials, curriculum details, announcements, and 
            essential college resources at one place.
          </p>
        </div>

        <div className="p-6 border rounded-lg shadow-sm  bg-[#48cae4]">
          <h2 className="text-xl font-semibold mb-2">🌱 Our Vision</h2>
          <p className="text-gray-600">
            To enhance the learning experience of every student by offering organized, 
            accessible, and up-to-date academic content, promoting smarter learning and growth.
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-10 text-center">
        <h2 className="text-xl font-semibold mb-2">📞 Need Help?</h2>
        <p className="text-gray-700">You can reach us through the <a href="/contact" className="text-blue-600 underline">Contact Page</a>.</p>
      </div>
    </div>
  );
};

export default About;

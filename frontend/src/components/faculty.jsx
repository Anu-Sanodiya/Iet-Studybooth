import React from 'react';
import { Mail, Phone, Smartphone } from 'lucide-react';

// --- Mock Data Based on Provided Image ---
// You can easily add more departments and faculty members here
const facultyData = {
  "Computer Engineering Department": {
    hod: {
      name: "Dr. Ashish Kumar Jain",
      designation: "Professor",
      researchArea: "Mobile Ad Hoc Network, Network Security",
      email: "ajain@ietdavv.edu.in",
      contact: "(o): 0731-2361117 Ext.-",
      mobile: "+91 93295 39402",
      image: "https://placehold.co/100x100/EBF8FF/3182CE?text=A+J" // Placeholder
    },
    members: [
      {
        name: "Dr. (Mrs) Meena Sharma",
        designation: "Professor",
        researchArea: "Software Engineering, Software Quality",
        email: "msharma@ietdavv.edu.in",
        contact: "(o): 0731-2361117 Ext.-218",
        mobile: "+91 98269 27378",
        image: "https://placehold.co/100x100/EBF8FF/3182CE?text=M+S" // Placeholder
      },
      {
        name: "Dr. G.L. Prajapati",
        designation: "Professor",
        researchArea: "Data Structures",
        email: "glprajapati@ietdavv.edu.in",
        contact: "(o): 0731-2361117 Ext.-204",
        mobile: "+91 98266 69205",
        image: "https://placehold.co/100x100/EBF8FF/3182CE?text=G+P" // Placeholder
      }
    ]
  },
  "Information Technology Department": {
    hod: {
      name: "Dr. IT Head",
      designation: "Professor",
      researchArea: "Cloud Computing",
      email: "ithead@ietdavv.edu.in",
      contact: "(o): 0731-2361117 Ext.-300",
      mobile: "+91 99999 88888",
      image: "https://placehold.co/100x100/EBF8FF/3182CE?text=IT+H" // Placeholder
    },
    members: [
      {
        name: "Dr. IT Faculty",
        designation: "Associate Professor",
        researchArea: "Cyber Security",
        email: "itfaculty@ietdavv.edu.in",
        contact: "(o): 0731-2361117 Ext.-301",
        mobile: "+91 98765 43210",
        image: "https://placehold.co/100x100/EBF8FF/3182CE?text=IT+F" // Placeholder
      }
    ]
  }
  // ... Add other departments here
};
// --- End Mock Data ---


/**
 * A reusable component to display a single faculty member's details.
 */
const FacultyCard = ({ member }) => {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 w-full">
      {/* Image */}
      <div className="flex-shrink-0 p-4 flex items-center justify-center">
        <img 
          className="h-24 w-24 rounded-full object-cover border-4 border-blue-100" 
          src={member.image} 
          alt={member.name} 
        />
      </div>

      {/* Name and Research Area */}
      <div className="flex-grow p-4 border-b sm:border-b-0 sm:border-r border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
        <p className="text-md text-blue-700 font-semibold">{member.designation}</p>
        <p className="text-sm text-gray-600 mt-2">
          <span className="font-semibold">Research Area:</span> {member.researchArea}
        </p>
      </div>

      {/* Contact Details */}
      <div className="flex-shrink-0 p-4 bg-gray-50 min-w-[300px]">
        <h4 className="text-md font-semibold text-gray-700 mb-2">Contact Details</h4>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Mail size={16} className="mr-2 text-blue-600" />
            <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone size={16} className="mr-2 text-blue-600" />
            <span>{member.contact}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Smartphone size={16} className="mr-2 text-blue-600" />
            <span>{member.mobile}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * The main page component that loops through departments.
 */
const FacultyPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {Object.entries(facultyData).map(([departmentName, data]) => (
        <section key={departmentName} className="mb-12">
          
          {/* Department Title */}
          <h1 className="text-4xl font-extrabold text-[#800000] mb-6 pb-2 border-b-4 border-[#800000]">
            {departmentName}
          </h1>

          {/* Head of Department */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-300">
              Head of Department
            </h2>
            <FacultyCard member={data.hod} />
          </div>

          {/* Faculty Members */}
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-300">
              Faculty Members
            </h2>
            <div className="space-y-6">
              {data.members.map((member) => (
                <FacultyCard key={member.name} member={member} />
              ))}
            </div>
          </div>

        </section>
      ))}
    </div>
  );
};

export default FacultyPage;
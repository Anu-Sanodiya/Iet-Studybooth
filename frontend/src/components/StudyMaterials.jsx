// import { useState, useEffect } from "react";

// const StudyMaterials = () => {
//   const [materials, setMaterials] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch study materials from backend
//   useEffect(() => {
//     const fetchMaterials = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/materials");
//         const data = await res.json();
//         setMaterials(data);
//       } catch (error) {
//         console.error("Error fetching study materials:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMaterials();
//   }, []);

//   // ✅ Filter search results
//   const filteredMaterials = materials.filter(
//     (item) =>
//       item.title?.toLowerCase().includes(search.toLowerCase()) ||
//       item.subject?.toLowerCase().includes(search.toLowerCase())
//   );

//   // ✅ Download file handler
//   const handleDownload = async (id, title) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/materials/download/${id}`,
//         {
//           method: "GET",
//         }
//       );

//       if (!response.ok) throw new Error("Failed to download file");

//       // Convert to blob and create a download link
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = title || "material";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download error:", error);
//       alert("Failed to download the file");
//     }
//   };

//   if (loading) {
//     return <p className="p-6 text-gray-600">Loading study materials...</p>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">📘 Study Materials</h1>

//       {/* Search Bar */}
//       <input
//         type="text"
//         placeholder="Search by title or subject..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
//       />

//       {/* Materials List */}
//       {filteredMaterials.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredMaterials.map((material) => (
//             <div
//               key={material._id}
//               className="p-4 border rounded shadow-sm bg-white"
//             >
//               <h3 className="font-semibold text-lg">{material.title}</h3>
//               <p className="text-gray-600 text-sm">{material.subject}</p>
//               <p className="text-gray-500 text-xs mt-1">
//                 {material.description}
//               </p>
//               <button
//                 onClick={() => handleDownload(material._id, material.title)}
//                 className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//               >
//                 View / Download
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No materials found.</p>
//       )}
//     </div>
//   );
// };

// export default StudyMaterials;

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, Search, XCircle, FileText, BookOpen, ArrowLeft, 
  Laptop, Network, HardHat, Cog, CircuitBoard, Brain, Zap 
} from 'lucide-react';

// --- HIERARCHICAL MOCK DATA ---
const mockEngineeringData = [
  {
    id: 'cs',
    name: 'Computer Science',
    icon: 'cs',
    subjects: [
      { 
        id: 103, 
        title: "Database Normalization Principles", 
        subject: "Computer Science", 
        description: "1NF, 2NF, 3NF, and BCNF explained.", 
        fileType: "pptx" 
      },
      { 
        id: 105, 
        title: "Data Structures & Algorithms", 
        subject: "Computer Science", 
        description: "In-depth guide to trees, graphs, and sorting.", 
        fileType: "pdf" 
      },
    ]
  },
  {
    id: 'it',
    name: 'Information Technology',
    icon: 'it',
    subjects: [
      { 
        id: 201, 
        title: "Network Security Fundamentals", 
        subject: "Information Technology", 
        description: "Firewalls, VPNs, and intrusion detection systems.", 
        fileType: "docx" 
      },
    ]
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    icon: 'civil',
    subjects: [
      { 
        id: 301, 
        title: "Structural Analysis", 
        subject: "Civil Engineering", 
        description: "Analysis of determinate and indeterminate structures.", 
        fileType: "pdf" 
      },
    ]
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    icon: 'mech',
    subjects: [
      { 
        id: 401, 
        title: "Thermodynamics Basics", 
        subject: "Mechanical Engineering", 
        description: "Laws of thermodynamics and heat engines.", 
        fileType: "pptx" 
      },
      { 
        id: 101, 
        title: "Quantum Mechanics: Introduction", 
        subject: "Physics (Mech Elective)", 
        description: "Foundational concepts and Schrödinger's equation.", 
        fileType: "pdf" 
      },
    ]
  },
  {
    id: 'ei',
    name: 'Electronics & Instrumentation',
    icon: 'ei',
    subjects: [
      { 
        id: 501, 
        title: "Sensor Technology", 
        subject: "E&I", 
        description: "Guide to various types of industrial sensors.", 
        fileType: "pdf" 
      },
    ]
  },
  {
    id: 'csbs',
    name: 'CS & Business Systems',
    icon: 'csbs',
    subjects: [
      { 
        id: 601, 
        title: "Intro to Financial Markets", 
        subject: "CSBS", 
        description: "Overview of stocks, bonds, and derivatives.", 
        fileType: "docx" 
      },
      { 
        id: 102, 
        title: "Renaissance Art History", 
        subject: "History (HSS Elective)", 
        description: "Key artists and cultural impact of the Renaissance period.", 
        fileType: "docx" 
      },
    ]
  },
  {
    id: 'eee',
    name: 'Electrical & Electronics',
    icon: 'eee',
    subjects: [
      { 
        id: 701, 
        title: "Circuit Theory", 
        subject: "EEE", 
        description: "Analysis of KVL, KCL, and basic circuits.", 
        fileType: "pdf" 
      },
      { 
        id: 104, 
        title: "Organic Chemistry Reactions", 
        subject: "Chemistry (HSS Elective)", 
        description: "A quick reference for common reaction mechanisms.", 
        fileType: "pdf" 
      },
    ]
  }
];
// --- END MOCK DATA ---

// --- NEW Component for Branch Icons ---
const BranchIcon = ({ iconName, className = "w-16 h-16 text-blue-600" }) => {
  switch (iconName) {
    case 'cs': return <Laptop className={className} />;
    case 'it': return <Network className={className} />;
    case 'civil': return <HardHat className={className} />;
    case 'mech': return <Cog className={className} />;
    case 'ei': return <CircuitBoard className={className} />;
    case 'csbs': return <Brain className={className} />;
    case 'eee': return <Zap className={className} />;
    default: return <BookOpen className={className} />;
  }
};

// Component for Filetype Icons
const FileIcon = ({ fileType }) => {
  switch (fileType) {
    case 'pdf':
      return <FileText className="text-red-500 w-5 h-5" />;
    case 'docx':
      return <BookOpen className="text-blue-500 w-5 h-5" />;
    case 'pptx':
      return <BookOpen className="text-orange-500 w-5 h-5" />;
    default:
      return <FileText className="text-gray-500 w-5 h-5" />;
  }
};

// Main App Component
const StudyMaterials = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Custom function to replace forbidden alert()
  const notify = useCallback((message, type = 'error') => {
    setNotification({ message, type });
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch branches from backend (MOCK implementation)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setBranches(mockEngineeringData);
      } catch (err) {
        console.error("Error fetching branches:", err);
        notify("Could not load department data.", 'error');
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [notify]);

  // --- NAVIGATION HANDLERS ---
  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    setSubjectSearch(""); // Reset search when changing branches
  };

  const handleBackClick = () => {
    setSelectedBranch(null);
    setSubjectSearch("");
  };

  // Filter search results for subjects
  const filteredSubjects = selectedBranch ? selectedBranch.subjects.filter(
    (subject) =>
      subject.title?.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      subject.description?.toLowerCase().includes(subjectSearch.toLowerCase())
  ) : [];

  // Download file handler (SIMULATED implementation)
  const handleDownload = (id, title, fileType) => {
    setNotification({ message: `Simulating download for "${title}"...`, type: 'info' });

    setTimeout(() => {
      const mockContent = `This is a simulated ${fileType} file content for ${title}.`;
      const blob = new Blob([mockContent], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.${fileType}` || "material";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      notify(`Successfully simulated download for ${title}.`, 'success');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-lg text-gray-600">Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        
      {/* Notification Area */}
      {notification && (
        <div 
          role="alert"
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl flex items-center transition-opacity duration-300 z-50 
            ${notification.type === 'error' ? 'bg-red-100 text-red-700 border border-red-400' : 
             notification.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 
             'bg-blue-100 text-blue-700 border border-blue-400'
            }`}
        >
          {notification.type === 'error' && <XCircle className="w-5 h-5 mr-2" />}
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* CONDITIONAL RENDERING: Show Subjects OR Branches */}
        {selectedBranch ? (
          // --- SUBJECTS VIEW ---
          <div>
            <button
              onClick={handleBackClick}
              className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Departments
            </button>

            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center">
              <BranchIcon iconName={selectedBranch.icon} className="w-8 h-8 mr-3 text-blue-600" />
              {selectedBranch.name}
            </h1>

            {/* Search Bar for Subjects */}
            <div className="mb-8 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search subjects in this department..."
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-lg focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
              />
            </div>

            {/* Subjects List */}
            {filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="p-5 border border-gray-200 rounded-xl shadow-lg bg-white hover:shadow-xl transition duration-300 flex flex-col"
                  >
                    <div className="flex items-center mb-3">
                      <FileIcon fileType={subject.fileType} />
                      <h3 className="font-bold text-xl ml-3 text-gray-800">{subject.title}</h3>
                    </div>
                    
                    <p className="text-blue-600 font-medium text-sm mb-2 uppercase tracking-wider">{subject.subject}</p>
                    <p className="text-gray-600 flex-grow mb-4">{subject.description}</p>
                    
                    <p className="text-gray-500 text-xs mt-auto mb-3">File Type: {subject.fileType.toUpperCase()}</p>
                    
                    <button
                      onClick={() => handleDownload(subject.id, subject.title, subject.fileType)}
                      className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center shadow-md"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-white rounded-xl shadow-lg">
                <p className="text-xl text-gray-500">No subjects found matching your search.</p>
              </div>
            )}
          </div>
        ) : (
          // --- BRANCHES VIEW (DEFAULT) ---
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
              Engineering Departments
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  onClick={() => handleBranchClick(branch)}
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 cursor-pointer border border-gray-200"
                >
                  <BranchIcon iconName={branch.icon} className="w-16 h-16 text-blue-600 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 text-center">{branch.name}</h2>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
)};
export default StudyMaterials;
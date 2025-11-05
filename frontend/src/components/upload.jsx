import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, Search, XCircle, FileText, BookOpen, ArrowLeft, 
  Laptop, Network, HardHat, Cog, CircuitBoard, Brain, Zap,
  Upload, Home, PlusCircle
} from 'lucide-react';

// --- HIERARCHICAL MOCK DATA (Initial State) ---
const initialEngineeringData = [
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

// --- Child Components ---

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

// --- NEW: Header Component for Navigation ---
const Header = ({ currentView, onNavigate }) => {
  const commonButtonClass = "flex items-center px-4 py-2 rounded-lg font-medium transition duration-200";
  const activeButtonClass = "bg-blue-600 text-white shadow-md";
  const inactiveButtonClass = "bg-white text-gray-700 hover:bg-gray-100 shadow-sm border";

  return (
    <nav className="mb-8 p-4 bg-white rounded-xl shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-700">Study Hub</h1>
      <div className="flex space-x-4">
        <button 
          onClick={() => onNavigate('browser')}
          className={`${commonButtonClass} ${currentView === 'browser' ? activeButtonClass : inactiveButtonClass}`}
        >
          <Home className="w-5 h-5 mr-2" />
          Browse
        </button>
        <button 
          onClick={() => onNavigate('uploader')}
          className={`${commonButtonClass} ${currentView === 'uploader' ? activeButtonClass : inactiveButtonClass}`}
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload
        </button>
      </div>
    </nav>
  );
};

// --- NEW: Uploader Component ---
const Uploader = ({ departments, onUploadSuccess, notify }) => {
  const [department, setDepartment] = useState(departments[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!department || !title || !file) {
      notify("Please fill in all fields and select a file.", 'error');
      return;
    }

    setIsUploading(true);
    notify("Simulating file upload...", 'info');

    // Simulate upload delay
    setTimeout(() => {
      const selectedDeptData = departments.find(d => d.id === department);
      
      const newSubject = {
        id: Date.now(), // Use timestamp for unique ID in mock env
        title: title,
        subject: selectedDeptData.name, // Use department name as subject
        description: description,
        fileType: file.name.split('.').pop() || 'file' // Get file extension
      };

      // Call the main handler in App.jsx to update the state
      onUploadSuccess(department, newSubject);
      
      setIsUploading(false);
      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      e.target.reset(); // Resets the file input
    }, 1500);
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <PlusCircle className="w-7 h-7 mr-3 text-blue-600" />
        Upload New Study Material
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          >
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Subject Name / Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Advanced Algorithms"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief summary of the material..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            File
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && <p className="text-xs text-gray-600 mt-2">Selected: {file.name}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center shadow-md disabled:bg-gray-400"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Material
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


// --- UPDATED: Browser Component ---
// (This is the old App component, refactored to be a child)
const DepartmentBrowser = ({ departments, onDownload }) => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [subjectSearch, setSubjectSearch] = useState("");

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    setSubjectSearch(""); // Reset search when changing branches
  };

  const handleBackClick = () => {
    setSelectedBranch(null);
    setSubjectSearch("");
  };

  const filteredSubjects = selectedBranch ? selectedBranch.subjects.filter(
    (subject) =>
      subject.title?.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      subject.description?.toLowerCase().includes(subjectSearch.toLowerCase())
  ) : [];
  
  return (
    <>
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
                    onClick={() => onDownload(subject.id, subject.title, subject.fileType)}
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
            {departments.map((branch) => (
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
    </>
  );
};


// --- Main App Component (Controller) ---
const Upload = () => {
  // --- STATE ---
  const [engineeringData, setEngineeringData] = useState([]);
  const [currentView, setCurrentView] = useState('browser'); // 'browser' or 'uploader'
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // --- NOTIFICATION HANDLER ---
  const notify = useCallback((message, type = 'error') => {
    setNotification({ message, type });
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  // --- DATA LOADING ---
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setEngineeringData(initialEngineeringData);
      } catch (err) {
        console.error("Error fetching branches:", err);
        notify("Could not load department data.", 'error');
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [notify]);

  // --- HANDLERS ---
  const handleDownload = (id, title, fileType) => {
    notify(`Simulating download for "${title}"...`, 'info');
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

  const handleUploadSuccess = (departmentId, newSubject) => {
    setEngineeringData(currentData => {
      return currentData.map(dept => {
        if (dept.id === departmentId) {
          // Add new subject to the correct department
          return {
            ...dept,
            subjects: [...dept.subjects, newSubject]
          };
        }
        return dept;
      });
    });
    notify('File uploaded successfully! Check the browse tab.', 'success');
    setCurrentView('browser'); // Switch back to browser to see the result
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
        
        {/* Main Header & Navigation */}
        <Header currentView={currentView} onNavigate={setCurrentView} />
        
        {/* Conditional View Rendering */}
        {currentView === 'browser' ? (
          <DepartmentBrowser 
            departments={engineeringData} 
            onDownload={handleDownload} 
          />
        ) : (
          <Uploader 
            departments={engineeringData} 
            onUploadSuccess={handleUploadSuccess}
            notify={notify}
          />
        )}
      </div>
    </div>
  );
};

export default Upload;


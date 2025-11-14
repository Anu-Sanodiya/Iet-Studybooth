import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Download, Search, XCircle, FileText, BookOpen, ArrowLeft,
  Laptop, Network, HardHat, Cog, CircuitBoard, Brain, Zap,
  UploadCloud, Home, PlusCircle
} from 'lucide-react';
import { getMaterials, uploadMaterial, downloadMaterial } from '../services/materialService';

/* =========================
   Utilities
========================= */
const getFileExtension = (name = '') => (name.split('.').pop() || '').toLowerCase();

const getBranchIconName = (course = '') => {
  const key = (course || '').toLowerCase();
  if (key.includes('computer') || key.includes('cse')) return 'cs';
  if (key.includes('electrical') || key.includes('ece') || key.includes('eee')) return 'eee';
  if (key.includes('civil')) return 'civil';
  if (key.includes('mechanical')) return 'mech';
  if (key.includes('electronics') || key.includes('instrumentation') || key.includes('e&i')) return 'ei';
  if (key.includes('information technology') || key.includes('it')) return 'it';
  if (key.includes('business systems') || key.includes('csbs')) return 'csbs';
  return 'book';
};

/* =========================
   Icons
========================= */
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
  switch ((fileType || '').toLowerCase()) {
    case 'pdf': return <FileText className="text-red-500 w-5 h-5" />;
    case 'doc':
    case 'docx': return <BookOpen className="text-blue-500 w-5 h-5" />;
    case 'ppt':
    case 'pptx':
    case 'pptm': return <BookOpen className="text-orange-500 w-5 h-5" />;
    default: return <FileText className="text-gray-500 w-5 h-5" />;
  }
};

/* =========================
   Notifications
========================= */
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  const typeClasses = {
    error: 'bg-red-100 text-red-700 border border-red-400',
    success: 'bg-green-100 text-green-700 border border-green-400',
    info: 'bg-blue-100 text-blue-700 border border-blue-400',
  };
  return (
    <div role="alert" className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl flex items-center transition-opacity duration-300 z-50 ${typeClasses[type]}`}>
      {type === 'error' && <XCircle className="w-5 h-5 mr-2" />}
      {message}
      <button onClick={onClose} className="ml-4 text-gray-600 hover:text-gray-800">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

/* =========================
   Header/Nav
========================= */
const AppHeader = ({ currentView, onNavigate }) => {
  const common = 'flex items-center px-4 py-2 rounded-lg font-medium transition duration-200';
  const active = 'bg-[#001845] text-[#979dac] shadow-md';
  const idle = 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border';
  return (
    <nav className="mb-8 p-4 bg-white rounded-xl shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-700">Iet StudyBooth</h1>
      <div className="flex space-x-4">
        <button onClick={() => onNavigate('browser')} className={`${common} ${currentView === 'browser' ? active : idle}`}>
          <Home className="w-5 h-5 mr-2" /> Browse
        </button>
        <button onClick={() => onNavigate('uploader')} className={`${common} ${currentView === 'uploader' ? active : idle}`}>
          <UploadCloud className="w-5 h-5 mr-2" /> Upload
        </button>
      </div>
    </nav>
  );
};

/* =========================
   Uploader
========================= */
const MaterialUploader = ({ departments, onUploaded, notify }) => {
  const [course, setCourse] = useState(departments[0]?.name || '');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [semester, setSemester] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course || !subject || !file) {
      notify('Please select a course, provide a subject, and choose a file.', 'error');
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('course', course);
    if (semester) fd.append('semester', semester);
    fd.append('subject', subject);
    if (description) fd.append('description', description);

    setIsUploading(true);
    try {
      const { data } = await uploadMaterial(fd);
      notify('Material uploaded successfully!', 'success');
      onUploaded?.(data);
      setSubject(''); setDescription(''); setSemester(''); setFile(null);
      e.target.reset();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to upload material.';
      notify(msg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <PlusCircle className="w-7 h-7 mr-3 text-blue-600" />Upload New Study Material
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Course / Department</label>
          <select
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {departments.map((d) => (<option key={d.name} value={d.name}>{d.name}</option>))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Semester (optional)</label>
            <input
              id="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g., 5"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., DBMS"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">File *</label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".pdf,.ppt,.pptx,.pptm,.doc,.docx,.xls,.xlsx,.txt"
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-gray-400 flex items-center justify-center"
        >
          {isUploading ? (
            <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />Uploading…</>
          ) : (
            <><UploadCloud className="w-5 h-5 mr-2" />Upload Material</>
          )}
        </button>
      </form>
    </div>
  );
};

/* =========================
   Cards
========================= */
const DepartmentCard = ({ branch, onClick }) => (
  <div
    onClick={() => onClick(branch)}
    className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition cursor-pointer border border-gray-200"
  >
    <BranchIcon iconName={branch.icon} className="w-16 h-16 text-blue-600 mb-4" />
    <h2 className="text-xl font-semibold text-gray-800 text-center">{branch.name}</h2>
    <p className="text-sm text-gray-500 mt-1">{branch.subjects.length} materials</p>
  </div>
);

const MaterialCard = ({ material, onDownload }) => (
  <div className="p-5 border border-gray-200 rounded-xl shadow-lg bg-white hover:shadow-xl transition flex flex-col">
    <div className="flex items-center mb-3">
      <FileIcon fileType={material.fileType} />
      <h3 className="font-bold text-xl ml-3 text-gray-800">{material.title}</h3>
    </div>
    <p className="text-blue-600 font-medium text-sm mb-2 uppercase tracking-wider">{material.subject}</p>
    <p className="text-gray-600 flex-grow mb-4">{material.description}</p>
    <p className="text-gray-500 text-xs mt-auto mb-3">File Type: {material.fileType?.toUpperCase()}</p>
    <button
      onClick={() => onDownload(material._id || material.id, material.originalName || material.title)}
      className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center shadow-md"
    >
      <Download className="w-5 h-5 mr-2" />Download
    </button>
  </div>
);

/* =========================
   Department Browser
   - now emits the currently visible materials up to parent
========================= */
const DepartmentBrowser = ({
  departments,
  onDownload,
  globalQuery,
  onGlobalQueryChange,
  onGlobalSearchSubmit,
  onVisibleMaterialsChange, // <-- NEW
}) => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [subjectSearch, setSubjectSearch] = useState('');

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    setSubjectSearch('');
  };
  const handleBackClick = () => {
    setSelectedBranch(null);
    setSubjectSearch('');
  };

  // compute filtered subjects in the selected branch
  const filteredSubjects = useMemo(() => {
    if (!selectedBranch) return [];
    const q = subjectSearch.toLowerCase();
    if (!q) return selectedBranch.subjects;
    return selectedBranch.subjects.filter(
      (s) =>
        (s.title || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
    );
  }, [selectedBranch, subjectSearch]);

  // ALSO compute the default visible list when no branch is selected
  const allSubjects = useMemo(
    () => departments.flatMap((d) => d.subjects),
    [departments]
  );

  // Emit currently visible materials to parent (kept in sync)
  useEffect(() => {
    if (selectedBranch) {
      onVisibleMaterialsChange?.(filteredSubjects);
    } else {
      onVisibleMaterialsChange?.(allSubjects);
    }
  }, [selectedBranch, filteredSubjects, allSubjects, onVisibleMaterialsChange]);

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-72 rounded-xl border border-gray-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Search all materials (server text search)…"
            value={globalQuery}
            onChange={(e) => onGlobalQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onGlobalSearchSubmit()}
          />
        </div>
        <button onClick={onGlobalSearchSubmit} className="rounded-xl bg-white border px-4 py-2 shadow hover:bg-gray-50">Search</button>
      </div>

      {selectedBranch ? (
        <div>
          <button onClick={handleBackClick} className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition">
            <ArrowLeft className="w-5 h-5 mr-2" />Back to Departments
          </button>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center">
            <BranchIcon iconName={selectedBranch.icon} className="w-8 h-8 mr-3 text-blue-600" />{selectedBranch.name}
          </h1>
          <div className="mb-8 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              placeholder="Filter subjects in this department..."
              className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-lg focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
          </div>
          {filteredSubjects.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((s) => (
                <MaterialCard key={s.id || s._id} material={s} onDownload={onDownload} />
              ))}
            </div>
          ) : (
            <div className="p-10 text-center bg-white rounded-xl shadow-lg">
              <p className="text-xl text-gray-500">No subjects found matching your filter.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Engineering Departments</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.map((branch) => (
              <DepartmentCard key={branch.name} branch={branch} onClick={handleBranchClick} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

/* =========================
   StudyMaterials (receives
   materials from Browse)
========================= */
const StudyMaterials = ({ materials, onDownload }) => {
  if (!materials?.length) {
    return null; // render nothing if nothing visible
  }
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Study Materials (from Browse)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <MaterialCard key={m.id || m._id} material={m} onDownload={onDownload} />
        ))}
      </div>
    </div>
  );
};

/* =========================
   Main Portal
========================= */
const StudyMaterialPortal = () => {
  const [departments, setDepartments] = useState([]);
  const [visibleMaterials, setVisibleMaterials] = useState([]); // <-- NEW
  const [currentView, setCurrentView] = useState('browser'); // 'browser' | 'uploader'
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const notify = useCallback((message, type = 'error') => {
    setNotification({ message, type });
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, []);
  const closeNotification = useCallback(() => setNotification(null), []);

  // Load & group materials by course/department
  const fetchMaterials = useCallback(async (query = '') => {
    setIsLoading(true);
    try {
      const res = await getMaterials(query ? { q: query } : undefined);
      const items = res.data || res || [];

      // Group by course
      const byCourse = new Map();
      items.forEach((m) => {
        const courseName = m.course || 'General';
        if (!byCourse.has(courseName)) byCourse.set(courseName, []);
        byCourse.get(courseName).push({
          _id: m._id,
          id: m._id,
          title: m.subject,
          subject: m.subject,
          description: m.description,
          originalName: m.originalName,
          fileType: getFileExtension(m.originalName),
        });
      });

      const grouped = Array.from(byCourse, ([name, subjects]) => ({
        name,
        icon: getBranchIconName(name),
        subjects,
      }));

      setDepartments(grouped);
      // default visible is "all subjects"
      setVisibleMaterials(grouped.flatMap(g => g.subjects));
    } catch (err) {
      notify(err?.response?.data?.message || err.message || 'Failed to load materials.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchMaterials(globalSearchQuery);
  }, [fetchMaterials, globalSearchQuery]);

  const handleDownload = async (id, fallbackName) => {
    try {
      notify('Initiating download…', 'info');
      const res = await downloadMaterial(id); // Axios/fetch wrapper should return { data: Blob, headers: {...} }
      const contentType = res.headers?.['content-type'] || 'application/octet-stream';
      const blob = new Blob([res.data], { type: contentType });

      // Try to get filename from header
      const cd = res.headers?.['content-disposition'] || '';
      const match = cd.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
      const filename = decodeURIComponent(match?.[1] || match?.[2] || '') || fallbackName || 'material';

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      notify('Download complete!', 'success');
    } catch (e) {
      notify(e?.response?.data?.message || e.message || 'Download failed.', 'error');
    }
  };

  const handleMaterialUploaded = () => {
    // refresh and switch back to browse
    fetchMaterials(globalSearchQuery);
    setCurrentView('browser');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-lg text-gray-600">Loading study materials…</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <Notification message={notification?.message} type={notification?.type} onClose={closeNotification} />
      <div className="max-w-6xl mx-auto">
        <AppHeader currentView={currentView} onNavigate={setCurrentView} />

        {currentView === 'browser' ? (
          <>
            <DepartmentBrowser
              departments={departments}
              onDownload={handleDownload}
              globalQuery={globalSearchQuery}
              onGlobalQueryChange={setGlobalSearchQuery}
              onGlobalSearchSubmit={() => fetchMaterials(globalSearchQuery)}
              onVisibleMaterialsChange={setVisibleMaterials}   // <-- KEY LINE
            />

            {/* This component always shows whatever is visible in Browse */}
            <StudyMaterials
              materials={visibleMaterials}
              onDownload={handleDownload}
            />
          </>
        ) : (
          <MaterialUploader
            departments={departments.length ? departments : [{ name: 'General', subjects: [] }]}
            onUploaded={handleMaterialUploaded}
            notify={notify}
          />
        )}
      </div>
    </div>
  );
};

export default StudyMaterialPortal;

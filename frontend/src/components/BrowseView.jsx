import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import {
  Download, Search, XCircle, FileText, BookOpen, ArrowLeft,
  Laptop, Network, HardHat, Cog, CircuitBoard, Brain, Zap
} from 'lucide-react';
import { getMaterials, deleteMaterial } from '../services/materialService';
import { AuthContext } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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

const MaterialCard = ({ material, onDownload, onDelete }) => (
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
    {onDelete && (
      <button
        onClick={() => onDelete(material._id || material.id)}
        className="w-full mt-2 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center shadow-md"
      >
        Delete
      </button>
    )}
  </div>
);

const DepartmentBrowser = ({
  departments,
  onDownload,
  onDelete,
  globalQuery,
  onGlobalQueryChange,
  onGlobalSearchSubmit,
  onVisibleMaterialsChange,
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

  const allSubjects = useMemo(() => departments.flatMap((d) => d.subjects), [departments]);

  useEffect(() => {
    if (selectedBranch) onVisibleMaterialsChange?.(filteredSubjects);
    else onVisibleMaterialsChange?.(allSubjects);
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
                <MaterialCard key={s.id || s._id} material={s} onDownload={onDownload} onDelete={onDelete} />
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

const BrowseView = () => {
  const [departments, setDepartments] = useState([]);
  const [visibleMaterials, setVisibleMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const notify = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const { user } = useContext(AuthContext);

  const isAdmin = (user?.role || '').toString().toLowerCase() === 'admin';

  const fetchMaterials = useCallback(async (query = '') => {
    setIsLoading(true);
    try {
      const params = { group: true };
      if (query) params.q = query;
      const res = await getMaterials(params);
      const items = res.data || res || [];

      // backend returns grouped departments when group=true
      if (Array.isArray(items) && items.length && items[0].subjects) {
        setDepartments(items);
        setVisibleMaterials(items.flatMap(d => d.subjects));
      } else {
        // fallback: group client-side
        const byCourse = new Map();
        (items || []).forEach((m) => {
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
            fileUrl: m.fileUrl,
          });
        });
        const grouped = Array.from(byCourse, ([name, subjects]) => ({ name, icon: getBranchIconName(name), subjects }));
        setDepartments(grouped);
        setVisibleMaterials(grouped.flatMap(g => g.subjects));
      }
    } catch (err) {
      notify(err?.response?.data?.message || err.message || 'Failed to load materials.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMaterials(globalSearchQuery); }, [fetchMaterials, globalSearchQuery]);

  const handleDownload = (id) => {
  const url = `${API_BASE}/materials/${id}/download`;
  console.log("Downloading from:", url);
  window.open(url, "_blank", "noopener,noreferrer");
  notify("Download started", "info");
};

  const handleDelete = async (id) => {
    if (!confirm('Delete this material? This action cannot be undone.')) return;
    try {
      await deleteMaterial(id);
      notify('Deleted successfully', 'success');
      // refresh list
      await fetchMaterials(globalSearchQuery);
    } catch (err) {
      notify(err?.response?.data?.message || err.message || 'Delete failed');
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="ml-4 text-lg text-gray-600">Loading departments...</p>
    </div>
  );

  return (
    <div>
      {notification && (
        <div role="alert" className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl flex items-center transition-opacity duration-300 z-50 bg-blue-100 text-blue-700 border border-blue-400`}>
          <XCircle className="w-5 h-5 mr-2" />{notification.message}
        </div>
      )}

      <DepartmentBrowser
        departments={departments}
        onDownload={handleDownload}
        onDelete={isAdmin ? handleDelete : undefined}
        globalQuery={globalSearchQuery}
        onGlobalQueryChange={setGlobalSearchQuery}
        onGlobalSearchSubmit={() => fetchMaterials(globalSearchQuery)}
        onVisibleMaterialsChange={() => { }}
      />

    </div>
  );
};

export default BrowseView;

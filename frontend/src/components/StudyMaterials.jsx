import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Download, Search, XCircle, FileText, BookOpen, ArrowLeft,
  Laptop, Network, HardHat, Cog, CircuitBoard, Brain, Zap
} from 'lucide-react';

/** =========================
 *  Minimal API helpers
 *  ========================= */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function getMaterials() {
  // Expected server response: { success: true, data: [ ...materials ] }
  const res = await fetch(`${API_BASE}/api/materials`);
  if (!res.ok) throw new Error('Failed to load materials');
  return res.json();
}

async function downloadMaterial(id) {
  const res = await fetch(`${API_BASE}/api/materials/${id}/download`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Download failed');
  }
  const blob = await res.blob();
  const cd = res.headers.get('content-disposition') || '';
  // try to extract filename from header if present
  const match = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(cd);
  const headerFilename = match ? decodeURIComponent(match[1]) : null;
  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  return { blob, filename: headerFilename, contentType };
}

function filePreviewUrl(relativePath) {
  return `${API_BASE}/${relativePath}`;
}

function extFromName(name = '') {
  const n = name.toLowerCase();
  const idx = n.lastIndexOf('.');
  return idx > -1 ? n.slice(idx + 1) : '';
}

/** =========================
 *  Icons
 *  ========================= */
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
  const t = (fileType || '').toLowerCase();
  if (t === 'pdf') return <FileText className="text-red-500 w-5 h-5" />;
  if (t === 'doc' || t === 'docx') return <BookOpen className="text-blue-500 w-5 h-5" />;
  if (t === 'ppt' || t === 'pptx') return <BookOpen className="text-orange-500 w-5 h-5" />;
  return <FileText className="text-gray-500 w-5 h-5" />;
};

/** =========================
 *  Data shaping
 *  - Your DB has: course, semester, subject, description, fileUrl, originalName, _id, mimeType
 *  - Group by `course` to create departments
 *  ========================= */
function groupMaterialsToDepartments(materials) {
  const byCourse = new Map();
  for (const m of (materials || [])) {
    const courseId = (m.course || 'General').toLowerCase().replace(/\s+/g, '-');
    if (!byCourse.has(courseId)) {
      // naive icon mapping by course name; customize as you like
      const iconMap = {
        'computer-science': 'cs',
        'information-technology': 'it',
        'civil-engineering': 'civil',
        'mechanical-engineering': 'mech',
        'electronics-&-instrumentation': 'ei',
        'cs-&-business-systems': 'csbs',
        'electrical-&-electronics': 'eee',
      };
      const icon = iconMap[courseId] || 'book';
      byCourse.set(courseId, {
        id: courseId,
        name: m.course || 'General',
        icon,
        subjects: [],
      });
    }
    const fileTypeGuess =
      extFromName(m.originalName) ||
      (m.mimeType ? m.mimeType.split('/').pop() : '');

    byCourse.get(courseId).subjects.push({
      id: m._id, // use Mongo _id
      title: m.subject || m.originalName || 'Untitled',
      subject: m.subject || m.originalName || 'Untitled',
      course: m.course || 'General',
      description: m.description || '',
      fileType: fileTypeGuess,
      fileUrl: m.fileUrl,           // e.g. "uploads/1700-file.pdf"
      originalName: m.originalName, // nice filename
      mimeType: m.mimeType,
    });
  }
  return Array.from(byCourse.values());
}

/** =========================
 *  Component
 *  ========================= */
const StudyMaterials = () => {
  const [departments, setDepartments] = useState([]); // grouped by course
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // notifier
  const notify = useCallback((message, type = 'error') => {
    setNotification({ message, type });
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, []);

  // fetch and group once
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMaterials();
        const grouped = groupMaterialsToDepartments(res.data || []);
        setDepartments(grouped);
      } catch (err) {
        console.error('Error fetching materials:', err);
        notify(err.message || 'Could not load materials', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [notify]);

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    setSubjectSearch('');
  };

  const handleBackClick = () => {
    setSelectedBranch(null);
    setSubjectSearch('');
  };

  const handleDownload = async (id, originalName = 'material') => {
    try {
      notify(`Preparing download for "${originalName}"...`, 'info');
      const { blob, filename } = await downloadMaterial(id);
      const finalName = filename || originalName || 'material';

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = finalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      notify(`Downloaded "${finalName}"`, 'success');
    } catch (error) {
      console.error('Download error:', error);
      notify(error.message || 'Failed to download the file', 'error');
    }
  };

  const filteredSubjects = useMemo(() => {
    if (!selectedBranch) return [];
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return selectedBranch.subjects;
    return selectedBranch.subjects.filter(s =>
      (s.title || '').toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q)
    );
  }, [selectedBranch, subjectSearch]);

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

      {/* Notification */}
      {notification && (
        <div
          role="alert"
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl flex items-center transition-opacity duration-300 z-50 
            ${notification.type === 'error' ? 'bg-red-100 text-red-700 border border-red-400' :
              notification.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' :
                'bg-blue-100 text-blue-700 border border-blue-400'
            }`}
        >
          {(notification.type === 'error') && <XCircle className="w-5 h-5 mr-2" />}
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {!selectedBranch ? (
          // Departments view
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
              Engineering Departments
            </h1>
            {departments.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-xl shadow">
                <p className="text-gray-600">No materials found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {departments.map(branch => (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchClick(branch)}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 cursor-pointer border border-gray-200"
                  >
                    <BranchIcon iconName={branch.icon} className="w-16 h-16 text-blue-600 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 text-center">{branch.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{branch.subjects.length} items</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Subjects view
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

            {/* Search */}
            <div className="mb-8 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search subjects in this department..."
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-lg focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
              />
              {subjectSearch && (
                <button
                  onClick={() => setSubjectSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Subjects list/cards */}
            {filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map(subject => (
                  <div
                    key={subject.id}
                    className="p-5 border border-gray-200 rounded-xl shadow-lg bg-white hover:shadow-xl transition duration-300 flex flex-col"
                  >
                    <div className="flex items-center mb-3">
                      <FileIcon fileType={subject.fileType} />
                      <h3 className="font-bold text-xl ml-3 text-gray-800">{subject.title}</h3>
                    </div>

                    <p className="text-blue-600 font-medium text-sm mb-2 uppercase tracking-wider">{subject.course}</p>
                    <p className="text-gray-600 flex-grow mb-4">{subject.description}</p>

                    <p className="text-gray-500 text-xs mt-auto mb-3">
                      File: {subject.originalName || 'Unnamed'}
                    </p>

                    <div className="flex items-center justify-between">
                      {subject.fileUrl && (
                        <a
                          className="text-sm underline"
                          href={filePreviewUrl(subject.fileUrl)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open
                        </a>
                      )}
                      <button
                        onClick={() => handleDownload(subject.id, subject.originalName || subject.title || 'material')}
                        className="ml-auto inline-flex items-center gap-1 text-sm bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-sm"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-white rounded-xl shadow-lg">
                <p className="text-xl text-gray-500">No subjects found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;

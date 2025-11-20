// import API from '../api/api';

// /**
//  * Upload a study material file along with metadata.
//  * Expects FormData with fields: file (File), subject (string), course?, semester?, description?
//  */
// export const uploadMaterial = async (formData) => {
//   // Let axios set the Content-Type with proper boundary for FormData
//   const res = await API.post('/materials', formData);
//   return res.data;
// };

// export const getMaterials = async (params = {}) => {
//   const res = await API.get('/materials', { params });
//   return res.data;
// };

// export const downloadMaterial = async (id) => {
//   const res = await API.get(`/materials/${id}/download`, { responseType: 'blob' });
//   return res;
// };

// export const deleteMaterial = async (id) => {
//   const res = await API.delete(`/materials/${id}`);
//   return res.data;
// };

import API from '../api/api';

/**
 * Upload study material
 */
export const uploadMaterial = async (formData) => {
  const res = await API.post('/materials', formData);
  return res.data;
};

/**
 * Get materials with filters
 */
export const getMaterials = async (params = {}) => {
  const res = await API.get('/materials', { params });
  return res.data;
};

/**
 * DO NOT USE AXIOS FOR DOWNLOAD!
 * Cloudinary signed URLs require browser window redirect.
 */
export const downloadMaterial = (id) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/materials/${id}/download`;
  window.open(url, "_blank", "noopener,noreferrer");
};


/**
 * Delete material
 */
export const deleteMaterial = async (id) => {
  const res = await API.delete(`/materials/${id}`);
  return res.data;
};

import API from '../api/api';

/**
 * Upload a study material file along with metadata.
 * Expects FormData with fields: file (File), subject (string), course?, semester?, description?
 */
export const uploadMaterial = async (formData) => {
  const res = await API.post('/materials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getMaterials = async (params = {}) => {
  const res = await API.get('/materials', { params });
  return res.data;
};

export const downloadMaterial = async (id) => {
  const res = await API.get(`/materials/${id}/download`, { responseType: 'blob' });
  return res;
};

export const deleteMaterial = async (id) => {
  const res = await API.delete(`/materials/${id}`);
  return res.data;
};

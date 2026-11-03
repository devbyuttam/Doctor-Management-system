import api from './axios.js';
export const uploadImage = (data) => api.post('/upload/profile-image', data);

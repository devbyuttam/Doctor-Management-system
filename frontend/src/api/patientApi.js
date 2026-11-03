import api from './axios.js';
export const getProfile = () => api.get('/patients/profile');

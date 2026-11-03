import api from './axios.js';
export const getDashboard = () => api.get('/admin/dashboard');

import api from './axios.js';
export const getPrescriptions = () => api.get('/prescriptions');

import api from './axios.js';
export const getRecords = () => api.get('/medical-records');

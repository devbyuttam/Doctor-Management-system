import api from './axios.js';
export const getAppointments = (params) => api.get('/appointments', { params });
export const bookAppointment = (data) => api.post('/appointments', data);

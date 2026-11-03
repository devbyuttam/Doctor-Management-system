import api from './axios.js';

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const logout = () => api.post('/auth/logout');
export const verifyDoctorId = (doctorId) => api.post('/auth/verify-doctor-id', { doctorId });
export const getDoctorRegistry = (params) => api.get('/auth/doctor-registry', { params });

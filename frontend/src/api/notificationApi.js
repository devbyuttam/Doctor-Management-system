import api from './axios.js';
export const getNotifications = () => api.get('/notifications');

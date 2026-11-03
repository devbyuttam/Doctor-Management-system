import api from './axios.js';
export const getReviews = (doctorId) => api.get(`/reviews/doctor/${doctorId}`);

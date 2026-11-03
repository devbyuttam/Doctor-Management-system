import api from './axios.js';
export const chatAI = (data) => api.post('/ai/chat', data);

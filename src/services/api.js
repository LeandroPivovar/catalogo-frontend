import axios from 'axios';

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Adiciona o token em todas as requisições
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http')) {
        return path;
    }
    // Remove o '/api' da baseURL para pegar a raiz do servidor onde as fotos estão
    const rootUrl = api.defaults.baseURL.replace('/api', '');
    return `${rootUrl}${path}`;
};

export default api;

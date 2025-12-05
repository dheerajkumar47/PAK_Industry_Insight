import axios from 'axios';

const API_URL = ''; // Relative path to use Vite proxy

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const companyService = {
  getAll: async (industry?: string) => {
    const url = industry ? `/companies?industry=${encodeURIComponent(industry)}` : '/companies';
    const response = await api.get(url);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get(`/companies/search?q=${query}`);
    return response.data;
  }
};

export const industryService = {
  getAll: async () => {
    const response = await api.get('/industries');
    return response.data;
  }
};

export default api;

import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || ''; // Use env var for Prod, proxy for Dev

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
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

export const newsService = {
  getAll: async (skip: number = 0, limit: number = 10, sort: string = 'latest') => {
    const response = await api.get(`/news?skip=${skip}&limit=${limit}&sort=${sort}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/news/stats');
    return response.data;
  },
  fetchLatest: async () => {
    const response = await api.get('/news/fetch');
    return response.data;
  }
};

export const marketService = {
  getLiveData: async () => {
    const response = await api.get('/market/live');
    return response.data;
  },
  refresh: async () => {
    const response = await api.post('/market/refresh');
    return response.data;
  }
};

export default api;

export const watchlistService = {
  get: async () => {
    const response = await api.get('/watchlist');
    return response.data;
  },
  add: async (companyId: string) => {
    const response = await api.post('/watchlist', { companyId });
    return response.data;
  },
  remove: async (companyId: string) => {
    const response = await api.delete(`/watchlist/${companyId}`);
    return response.data;
  }
};

export const aiService = {
  getMarketPulse: async () => {
    const response = await api.get('/ai/market-pulse');
    return response.data;
  },
  getCompanyInsight: async (companyId: string) => {
    const response = await api.get(`/ai/company-insight/${companyId}`);
    return response.data;
  }
};

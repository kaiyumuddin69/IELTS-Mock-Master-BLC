import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const testService = {
  getTests: async () => {
    const response = await api.get('/tests');
    return response.data;
  },
  createTest: async (testData: any) => {
    const response = await api.post('/tests', testData);
    return response.data;
  },
  deleteTest: async (id: string) => {
    const response = await api.delete(`/tests/${id}`);
    return response.data;
  },
  submitResult: async (resultData: any) => {
    const response = await api.post('/results', resultData);
    return response.data;
  },
  getMyResults: async () => {
    const response = await api.get('/results/me');
    return response.data;
  },
  getAdminSubmissions: async () => {
    const response = await api.get('/admin/submissions');
    return response.data;
  },
  updateSubmission: async (id: string, updateData: any) => {
    const response = await api.patch(`/admin/submissions/${id}`, updateData);
    return response.data;
  },
  clearAllData: async () => {
    const response = await api.delete('/admin/clear-all');
    return response.data;
  }
};

export const batchService = {
  getBatches: async () => {
    const response = await api.get('/batches');
    return response.data;
  },
  createBatch: async (batchData: any) => {
    const response = await api.post('/batches', batchData);
    return response.data;
  },
  updateBatch: async (id: string, batchData: any) => {
    const response = await api.patch(`/batches/${id}`, batchData);
    return response.data;
  }
};

export default api;

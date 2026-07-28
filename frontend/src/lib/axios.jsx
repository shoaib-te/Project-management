import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.yourdomain.com',
  timeout: 5000 // Stops requests if server stalls for 5 seconds
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default apiClient;
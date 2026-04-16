import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5031/api', // Port của ASP.NET API (Cần check lại nếu port khác)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

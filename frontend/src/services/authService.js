import api from './api';

class AuthService {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  async login(data) {
    const response = await api.post('/auth/login', data);
    return response.data;
  }

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  setAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getStoredToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();


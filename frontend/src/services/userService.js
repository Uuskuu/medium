import api from './api';

class UserService {
  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  }

  async getAuthors() {
    const response = await api.get('/admin/authors');
    return response.data;
  }

  async calculateSalaries(month) {
    const response = await api.post('/admin/salary/calculate', null, { params: { month } });
    return response.data;
  }

  async getSalaryReport(month) {
    const response = await api.get('/admin/salary/report', { params: { month } });
    return response.data;
  }
}

export default new UserService();


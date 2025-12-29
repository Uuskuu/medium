import api from './api';

const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Get all users (Admin only)
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Get all authors (Admin only)
  getAuthors: async () => {
    const response = await api.get('/admin/users/authors');
    return response.data;
  },

  // Get top authors by reputation
  getTopAuthors: async (limit = 5) => {
    const response = await api.get('/api/users/top-authors', { params: { limit } });
    return response.data.data;
  },

  // Update user role (Admin only)
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
};

export default userService;

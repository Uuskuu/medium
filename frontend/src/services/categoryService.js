import api from './api';

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/api/categories');
    return response.data.data;
  },

  // Get active categories only
  getActiveCategories: async () => {
    const response = await api.get('/api/categories/active');
    return response.data.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/api/categories/slug/${slug}`);
    return response.data.data;
  },

  // Create category (Admin only)
  createCategory: async (categoryData) => {
    const response = await api.post('/api/categories', categoryData);
    return response.data.data;
  },

  // Update category (Admin only)
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/api/categories/${id}`, categoryData);
    return response.data.data;
  },

  // Delete category (Admin only)
  deleteCategory: async (id) => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },

  // Refresh category post count (Admin only)
  refreshCategoryPostCount: async (id) => {
    const response = await api.post(`/api/categories/${id}/refresh-count`);
    return response.data;
  },
};

export default categoryService;


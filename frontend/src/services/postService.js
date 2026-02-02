import api from './api';

class PostService {
  async getApprovedPosts(page = 0, size = 10) {
    const response = await api.get('/posts', { params: { page, size } });
    return response.data;
  }

  async getApprovedPostsByCategory(categoryId, page = 0, size = 10) {
    const response = await api.get('/posts', { params: { categoryId, page, size } });
    return response.data;
  }

  async getPostById(id) {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  }

  async createPost(data) {
    const response = await api.post('/author/posts', data);
    return response.data;
  }

  async updatePost(id, data) {
    const response = await api.put(`/author/posts/${id}`, data);
    return response.data;
  }

  async deletePost(id) {
    const response = await api.delete(`/author/posts/${id}`);
    return response.data;
  }

  async submitForReview(id) {
    const response = await api.post(`/author/posts/${id}/submit`);
    return response.data;
  }

  async getMyPosts(page = 0, size = 10) {
    const response = await api.get('/author/posts/my', { params: { page, size } });
    return response.data;
  }

  async getMyPostsByStatus(status) {
    const response = await api.get(`/author/posts/my/status/${status}`);
    return response.data;
  }

  async toggleLike(postId) {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  }

  async getComments(postId) {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  }

  async addComment(postId, content, parentCommentId = null) {
    const response = await api.post(`/posts/${postId}/comments`, { 
      content,
      parentCommentId 
    });
    return response.data;
  }

  // Report post
  async reportPost(postId, reason, description) {
    const response = await api.post(`/posts/${postId}/report`, { reason, description });
    return response.data;
  }

  // Admin endpoints
  async getPendingPosts(page = 0, size = 10) {
    const response = await api.get('/admin/posts/pending', { params: { page, size } });
    return response.data;
  }

  async getReviewPosts(page = 0, size = 10) {
    const response = await api.get('/admin/posts/review', { params: { page, size } });
    return response.data;
  }

  async approvePost(id, note) {
    const response = await api.post(`/admin/posts/${id}/approve`, { note });
    return response.data;
  }

  async rejectPost(id, note) {
    const response = await api.post(`/admin/posts/${id}/reject`, { note });
    return response.data;
  }

  // Admin Report Management
  async getAllReports(page = 0, size = 10) {
    const response = await api.get('/admin/reports', { params: { page, size } });
    return response.data;
  }

  async getPendingReports(page = 0, size = 10) {
    const response = await api.get('/admin/reports/pending', { params: { page, size } });
    return response.data;
  }

  async reviewReport(id, status, note) {
    const response = await api.post(`/admin/reports/${id}/review`, { note }, { params: { status } });
    return response.data;
  }
}

export default new PostService();


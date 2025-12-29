import { makeAutoObservable, runInAction } from 'mobx';
import postService from '../services/postService';

class PostStore {
  posts = [];
  currentPost = null;
  myPosts = [];
  pendingPosts = [];
  loading = false;
  totalPages = 0;
  currentPage = 0;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchApprovedPosts(page = 0, size = 10) {
    this.loading = true;
    try {
      const response = await postService.getApprovedPosts(page, size);
      runInAction(() => {
        this.posts = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchApprovedPostsByCategory(categoryId, page = 0, size = 10) {
    this.loading = true;
    try {
      const response = await postService.getApprovedPostsByCategory(categoryId, page, size);
      runInAction(() => {
        this.posts = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      });
    } catch (error) {
      console.error('Failed to fetch posts by category:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchPostById(id) {
    this.loading = true;
    try {
      const post = await postService.getPostById(id);
      runInAction(() => {
        this.currentPost = post;
      });
      return post;
    } catch (error) {
      console.error('Failed to fetch post:', error);
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createPost(data) {
    this.loading = true;
    try {
      const post = await postService.createPost(data);
      return post;
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updatePost(id, data) {
    this.loading = true;
    try {
      const post = await postService.updatePost(id, data);
      return post;
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deletePost(id) {
    this.loading = true;
    try {
      await postService.deletePost(id);
      runInAction(() => {
        this.myPosts = this.myPosts.filter((p) => p.id !== id);
      });
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async submitForReview(id) {
    this.loading = true;
    try {
      const post = await postService.submitForReview(id);
      return post;
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchMyPosts(page = 0, size = 10) {
    this.loading = true;
    try {
      const response = await postService.getMyPosts(page, size);
      runInAction(() => {
        this.myPosts = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      });
    } catch (error) {
      console.error('Failed to fetch my posts:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchMyPostsByStatus(status) {
    this.loading = true;
    try {
      const posts = await postService.getMyPostsByStatus(status);
      runInAction(() => {
        this.myPosts = posts;
      });
    } catch (error) {
      console.error('Failed to fetch posts by status:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async toggleLike(postId) {
    try {
      const response = await postService.toggleLike(postId);
      if (this.currentPost && this.currentPost.id === postId) {
        runInAction(() => {
          this.currentPost.likes = response.data;
        });
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async fetchPendingPosts(page = 0, size = 10) {
    this.loading = true;
    try {
      const response = await postService.getPendingPosts(page, size);
      runInAction(() => {
        this.pendingPosts = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      });
    } catch (error) {
      console.error('Failed to fetch pending posts:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async approvePost(id, note) {
    try {
      await postService.approvePost(id, note);
      runInAction(() => {
        this.pendingPosts = this.pendingPosts.filter((p) => p.id !== id);
      });
    } catch (error) {
      throw error;
    }
  }

  async rejectPost(id, note) {
    try {
      await postService.rejectPost(id, note);
      runInAction(() => {
        this.pendingPosts = this.pendingPosts.filter((p) => p.id !== id);
      });
    } catch (error) {
      throw error;
    }
  }
}

export default PostStore;


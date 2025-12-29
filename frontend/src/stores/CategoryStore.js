import { makeAutoObservable, runInAction } from 'mobx';
import categoryService from '../services/categoryService';

class CategoryStore {
  categories = [];
  activeCategories = [];
  currentCategory = null;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAllCategories() {
    this.loading = true;
    this.error = null;
    try {
      const categories = await categoryService.getAllCategories();
      runInAction(() => {
        this.categories = categories;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }

  async fetchActiveCategories() {
    this.loading = true;
    this.error = null;
    try {
      const categories = await categoryService.getActiveCategories();
      runInAction(() => {
        this.activeCategories = categories;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }

  async fetchCategoryById(id) {
    this.loading = true;
    this.error = null;
    try {
      const category = await categoryService.getCategoryById(id);
      runInAction(() => {
        this.currentCategory = category;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }

  async createCategory(categoryData) {
    this.loading = true;
    this.error = null;
    try {
      const category = await categoryService.createCategory(categoryData);
      runInAction(() => {
        this.categories.push(category);
        this.loading = false;
      });
      return category;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
      throw error;
    }
  }

  async updateCategory(id, categoryData) {
    this.loading = true;
    this.error = null;
    try {
      const category = await categoryService.updateCategory(id, categoryData);
      runInAction(() => {
        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.categories[index] = category;
        }
        this.loading = false;
      });
      return category;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
      throw error;
    }
  }

  async deleteCategory(id) {
    this.loading = true;
    this.error = null;
    try {
      await categoryService.deleteCategory(id);
      runInAction(() => {
        this.categories = this.categories.filter((c) => c.id !== id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
      throw error;
    }
  }
}

export default CategoryStore;


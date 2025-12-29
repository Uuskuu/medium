import { makeAutoObservable, runInAction } from 'mobx';
import userService from '../services/userService';

class UserStore {
  users = [];
  authors = [];
  salaryRecords = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAllUsers() {
    this.loading = true;
    try {
      const users = await userService.getAllUsers();
      runInAction(() => {
        this.users = users;
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchAuthors() {
    this.loading = true;
    try {
      const authors = await userService.getAuthors();
      runInAction(() => {
        this.authors = authors;
      });
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async calculateSalaries(month) {
    this.loading = true;
    try {
      await userService.calculateSalaries(month);
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchSalaryReport(month) {
    this.loading = true;
    try {
      const records = await userService.getSalaryReport(month);
      runInAction(() => {
        this.salaryRecords = records;
      });
    } catch (error) {
      console.error('Failed to fetch salary report:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export default UserStore;


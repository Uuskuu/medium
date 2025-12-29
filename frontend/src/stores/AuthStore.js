import { makeAutoObservable, runInAction } from 'mobx';
import authService from '../services/authService';

class AuthStore {
  user = null;
  token = null;
  isAuthenticated = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
  }

  initializeAuth() {
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getStoredToken();

    if (storedUser && storedToken) {
      this.user = storedUser;
      this.token = storedToken;
      this.isAuthenticated = true;
    }
  }

  async register(data) {
    this.loading = true;
    try {
      const response = await authService.register(data);
      runInAction(() => {
        this.user = response.user;
        this.token = response.token;
        this.isAuthenticated = true;
        authService.setAuthData(response.token, response.user);
      });
      return response;
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async login(data) {
    this.loading = true;
    try {
      const response = await authService.login(data);
      runInAction(() => {
        this.user = response.user;
        this.token = response.token;
        this.isAuthenticated = true;
        authService.setAuthData(response.token, response.user);
      });
      return response;
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  logout() {
    authService.logout();
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
  }

  get isAuthor() {
    return this.user?.role === 'AUTHOR' || this.user?.role === 'ADMIN';
  }

  get isAdmin() {
    return this.user?.role === 'ADMIN';
  }
}

export default AuthStore;


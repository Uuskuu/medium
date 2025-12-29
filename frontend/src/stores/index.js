import React, { createContext, useContext } from 'react';
import AuthStore from './AuthStore';
import PostStore from './PostStore';
import UserStore from './UserStore';
import CategoryStore from './CategoryStore';

class RootStore {
  constructor() {
    this.authStore = new AuthStore();
    this.postStore = new PostStore();
    this.userStore = new UserStore();
    this.categoryStore = new CategoryStore();
  }
}

const rootStore = new RootStore();
const StoreContext = createContext(rootStore);

export const useStores = () => useContext(StoreContext);

export default rootStore;


import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStores } from './stores';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages
import Home from './pages/Home/Home';
import PostView from './pages/PostView/PostView';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AuthorDashboard from './pages/AuthorDashboard/Dashboard';
import CreatePost from './pages/AuthorDashboard/CreatePost';
import EditPost from './pages/AuthorDashboard/EditPost';
import MyPosts from './pages/AuthorDashboard/MyPosts';
import BackofficeDashboard from './pages/Backoffice/Dashboard';
import ReviewPosts from './pages/Backoffice/ReviewPosts';
import UserManagement from './pages/Backoffice/UserManagement';
import SalaryManagement from './pages/Backoffice/SalaryManagement';

// Protected Route Component
const ProtectedRoute = observer(({ children, requireRole }) => {
  const { authStore } = useStores();

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && authStore.user?.role !== requireRole && authStore.user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
});

const App = observer(() => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="posts/:id" element={<PostView />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Author Routes */}
          <Route path="author">
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requireRole="AUTHOR">
                  <AuthorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="posts"
              element={
                <ProtectedRoute requireRole="AUTHOR">
                  <MyPosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="posts/new"
              element={
                <ProtectedRoute requireRole="AUTHOR">
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="posts/:id/edit"
              element={
                <ProtectedRoute requireRole="AUTHOR">
                  <EditPost />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route path="admin">
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requireRole="ADMIN">
                  <BackofficeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="review"
              element={
                <ProtectedRoute requireRole="ADMIN">
                  <ReviewPosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute requireRole="ADMIN">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="salary"
              element={
                <ProtectedRoute requireRole="ADMIN">
                  <SalaryManagement />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
    </ConfigProvider>
  );
});

export default App;


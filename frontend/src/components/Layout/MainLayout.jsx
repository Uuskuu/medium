import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  HomeOutlined,
  EditOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { useStores } from '../../stores';
import './MainLayout.css';

const { Header, Content, Footer } = Layout;

const MainLayout = observer(() => {
  const { authStore } = useStores();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authStore.logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => {
        if (authStore.isAdmin) {
          navigate('/admin/dashboard');
        } else if (authStore.isAuthor) {
          navigate('/author/dashboard');
        }
      },
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Гарах',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Нүүр',
      onClick: () => navigate('/'),
    },
  ];

  if (authStore.isAuthor) {
    menuItems.push({
      key: '/author',
      icon: <EditOutlined />,
      label: 'Миний мэдээ',
      onClick: () => navigate('/author/posts'),
    });
  }

  if (authStore.isAdmin) {
    menuItems.push({
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Удирдлага',
      onClick: () => navigate('/admin/dashboard'),
    });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', display: 'flex', alignItems: 'center' }}>
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2 style={{ color: 'white', margin: 0 }}>Medee</h2>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0, marginLeft: 24 }}
        />
        {authStore.isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ color: 'white' }}>{authStore.user?.displayName || authStore.user?.username}</span>
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
            Нэвтрэх
          </Button>
        )}
      </Header>
      <Content style={{ padding: '24px 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 'calc(100vh - 180px)', borderRadius: 8 }}>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Medee ©{new Date().getFullYear()} - Мэдээллийн Блог Платформ
      </Footer>
    </Layout>
  );
});

export default MainLayout;


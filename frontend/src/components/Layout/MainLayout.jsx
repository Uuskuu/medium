import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Input, Drawer, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  HomeOutlined,
  EditOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useStores } from '../../stores';
import './MainLayout.css';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = observer(() => {
  const { authStore, postStore } = useStores();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const handleLogout = () => {
    authStore.logout();
    navigate('/');
  };

  const handleSearch = (value) => {
    if (value.trim()) {
      // Navigate to home with search query
      navigate(`/?search=${encodeURIComponent(value.trim())}`);
    }
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
    menuItems.push({
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Хэрэглэгч',
      onClick: () => navigate('/admin/users'),
    });
    menuItems.push({
      key: '/admin/review',
      icon: <EditOutlined />,
      label: 'Мэдээ шалгах',
      onClick: () => navigate('/admin/review'),
    });
    menuItems.push({
      key: '/admin/categories',
      icon: <HomeOutlined />,
      label: 'Категори',
      onClick: () => navigate('/admin/categories'),
    });
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header className="medium-header" style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Mobile Menu Button */}
        <Button
          className="mobile-menu-btn"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuVisible(true)}
          style={{ 
            display: 'none',
            fontSize: '20px',
            color: 'rgba(0, 0, 0, 0.68)'
          }}
        />

        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2 style={{ margin: 0 }}>Medium</h2>
        </div>

        {/* Search Bar */}
        <div className="header-search">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </div>

        <div style={{ flex: 1 }} />

        {authStore.isAuthenticated ? (
          <Space size="middle">
            {authStore.isAuthor && (
              <Button
                type="text"
                onClick={() => navigate('/author/posts/new')}
                style={{
                  color: 'rgba(0, 0, 0, 0.68)',
                  fontSize: '14px',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <EditOutlined />
                <span className="write-text">Write</span>
              </Button>
            )}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar style={{ backgroundColor: '#1a8917' }} icon={<UserOutlined />} />
                <span className="user-name" style={{ color: 'rgba(0, 0, 0, 0.68)', fontSize: '14px' }}>
                  {authStore.user?.displayName || authStore.user?.username}
                </span>
              </div>
            </Dropdown>
          </Space>
        ) : (
          <Button 
            type="default" 
            onClick={() => navigate('/login')}
            style={{ 
              borderRadius: '99em',
              backgroundColor: '#1a8917',
              color: '#ffffff',
              border: 'none',
              fontSize: '16px',
              fontWeight: 400,
              padding: '7px 16px',
              height: '40px'
            }}
          >
            Нэвтрэх
          </Button>
        )}
      </Header>

      <Layout style={{ backgroundColor: '#ffffff' }}>
        {/* Desktop Sidebar Menu */}
        <Sider
          className="desktop-sidebar"
          width={240}
          style={{
            background: '#ffffff',
            borderRight: '1px solid rgba(0, 0, 0, 0.05)',
            overflow: 'auto',
            height: 'calc(100vh - 75px)',
            position: 'sticky',
            top: 75,
            left: 0,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ 
              border: 'none',
              marginTop: 16 
            }}
          />
        </Sider>

        {/* Mobile Drawer Menu */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setMobileMenuVisible(false)}
          open={mobileMenuVisible}
          className="mobile-drawer"
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ border: 'none' }}
            onClick={() => setMobileMenuVisible(false)}
          />
        </Drawer>

        <Layout style={{ backgroundColor: '#ffffff' }}>
          <Content className="medium-layout-content">
            <div className="medium-content-wrapper">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>

      <Footer className="medium-footer" style={{ textAlign: 'center' }}>
        Medee ©{new Date().getFullYear()} — Мэдээллийн блог платформ
      </Footer>
    </Layout>
  );
});

export default MainLayout;


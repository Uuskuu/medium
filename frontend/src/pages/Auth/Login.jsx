import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';

const { Title, Text } = Typography;

const Login = observer(() => {
  const { authStore } = useStores();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authStore.login({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      });
      message.success('Амжилттай нэвтэрлээ!');
      
      // Navigate based on role
      if (authStore.isAdmin) {
        navigate('/admin/dashboard');
      } else if (authStore.isAuthor) {
        navigate('/author/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Нэвтрэх үед алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 24px' }}>
      <Card 
        style={{ 
          border: '1px solid rgba(0, 0, 0, 0.15)',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '32px'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Title 
          level={2} 
          style={{ 
            textAlign: 'center', 
            marginBottom: 32,
            fontFamily: 'Playfair Display, Georgia, Cambria, serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#242424'
          }}
        >
          Нэвтрэх
        </Title>
        <Form name="login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="usernameOrEmail"
            rules={[{ required: true, message: 'Хэрэглэгчийн нэр эсвэл имэйл оруулна уу!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />} 
              placeholder="Хэрэглэгчийн нэр эсвэл имэйл"
              style={{
                fontSize: '16px',
                padding: '12px 16px',
                borderColor: 'rgba(0, 0, 0, 0.15)',
                borderRadius: '4px'
              }}
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Нууц үг оруулна уу!' }]}>
            <Input.Password 
              prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />} 
              placeholder="Нууц үг"
              style={{
                fontSize: '16px',
                padding: '12px 16px',
                borderColor: 'rgba(0, 0, 0, 0.15)',
                borderRadius: '4px'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              style={{
                backgroundColor: '#1a8917',
                border: 'none',
                borderRadius: '99em',
                height: '48px',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              Нэвтрэх
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.68)' }}>
              Бүртгэл байхгүй юу?{' '}
              <Link 
                to="/register"
                style={{ 
                  color: '#1a8917',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                Бүртгүүлэх
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
});

export default Login;


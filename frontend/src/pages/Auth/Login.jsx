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
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Нэвтрэх
        </Title>
        <Form name="login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="usernameOrEmail"
            rules={[{ required: true, message: 'Хэрэглэгчийн нэр эсвэл имэйл оруулна уу!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Хэрэглэгчийн нэр эсвэл имэйл" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Нууц үг оруулна уу!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Нууц үг" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Нэвтрэх
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>
              Бүртгэл байхгүй юу? <Link to="/register">Бүртгүүлэх</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
});

export default Login;


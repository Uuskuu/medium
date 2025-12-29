import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Radio } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';

const { Title, Text } = Typography;

const Register = observer(() => {
  const { authStore } = useStores();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authStore.register({
        username: values.username,
        email: values.email,
        password: values.password,
        displayName: values.displayName,
        role: values.role || 'READER',
      });
      message.success('Амжилттай бүртгэгдлээ!');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Бүртгэл үүсгэх үед алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '60px auto', padding: '0 24px' }}>
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
          Бүртгүүлэх
        </Title>
        <Form name="register" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="username"
            label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#242424' }}>Хэрэглэгчийн нэр</span>}
            rules={[
              { required: true, message: 'Хэрэглэгчийн нэр оруулна уу!' },
              { min: 3, message: 'Хэрэглэгчийн нэр 3-аас дээш тэмдэгттэй байх ёстой!' },
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />} 
              placeholder="Хэрэглэгчийн нэр"
              style={{
                fontSize: '16px',
                padding: '12px 16px',
                borderColor: 'rgba(0, 0, 0, 0.15)',
                borderRadius: '4px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#242424' }}>Имэйл</span>}
            rules={[
              { required: true, message: 'Имэйл оруулна уу!' },
              { type: 'email', message: 'Зөв имэйл хаяг оруулна уу!' },
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />} 
              placeholder="Имэйл"
              style={{
                fontSize: '16px',
                padding: '12px 16px',
                borderColor: 'rgba(0, 0, 0, 0.15)',
                borderRadius: '4px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="displayName"
            label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#242424' }}>Дэлгэцийн нэр</span>}
            rules={[{ required: true, message: 'Дэлгэцийн нэр оруулна уу!' }]}
          >
            <Input 
              placeholder="Дэлгэцийн нэр"
              style={{
                fontSize: '16px',
                padding: '12px 16px',
                borderColor: 'rgba(0, 0, 0, 0.15)',
                borderRadius: '4px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#242424' }}>Нууц үг</span>}
            rules={[
              { required: true, message: 'Нууц үг оруулна уу!' },
              { min: 6, message: 'Нууц үг 6-аас дээш тэмдэгттэй байх ёстой!' },
            ]}
          >
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

          <Form.Item
            name="confirmPassword"
            label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#242424' }}>Нууц үг баталгаажуулах</span>}
            dependencies={['password']}
            rules={[
              { required: true, message: 'Нууц үгээ баталгаажуулна уу!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Нууц үг таарахгүй байна!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />} 
              placeholder="Нууц үг баталгаажуулах"
              style={{
                fontSize: '16px',
                padding: '12px 16px',
                borderColor: 'rgba(0, 0, 0, 0.15)',
                borderRadius: '4px'
              }}
            />
          </Form.Item>

          <Form.Item 
            name="role" 
            label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#242424' }}>Дүр</span>}
            initialValue="READER"
          >
            <Radio.Group>
              <Radio value="READER" style={{ fontSize: '14px' }}>Уншигч</Radio>
              <Radio value="AUTHOR" style={{ fontSize: '14px' }}>Нийтлэгч</Radio>
            </Radio.Group>
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
              Бүртгүүлэх
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.68)' }}>
              Бүртгэлтэй юу?{' '}
              <Link 
                to="/login"
                style={{ 
                  color: '#1a8917',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                Нэвтрэх
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
});

export default Register;


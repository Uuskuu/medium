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
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Бүртгүүлэх
        </Title>
        <Form name="register" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="username"
            label="Хэрэглэгчийн нэр"
            rules={[
              { required: true, message: 'Хэрэглэгчийн нэр оруулна уу!' },
              { min: 3, message: 'Хэрэглэгчийн нэр 3-аас дээш тэмдэгттэй байх ёстой!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Хэрэглэгчийн нэр" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Имэйл"
            rules={[
              { required: true, message: 'Имэйл оруулна уу!' },
              { type: 'email', message: 'Зөв имэйл хаяг оруулна уу!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Имэйл" />
          </Form.Item>

          <Form.Item
            name="displayName"
            label="Дэлгэцийн нэр"
            rules={[{ required: true, message: 'Дэлгэцийн нэр оруулна уу!' }]}
          >
            <Input placeholder="Дэлгэцийн нэр" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Нууц үг"
            rules={[
              { required: true, message: 'Нууц үг оруулна уу!' },
              { min: 6, message: 'Нууц үг 6-аас дээш тэмдэгттэй байх ёстой!' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Нууц үг" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Нууц үг баталгаажуулах"
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
            <Input.Password prefix={<LockOutlined />} placeholder="Нууц үг баталгаажуулах" />
          </Form.Item>

          <Form.Item name="role" label="Дүр" initialValue="READER">
            <Radio.Group>
              <Radio value="READER">Уншигч</Radio>
              <Radio value="AUTHOR">Нийтлэгч</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Бүртгүүлэх
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>
              Бүртгэлтэй юу? <Link to="/login">Нэвтрэх</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
});

export default Register;


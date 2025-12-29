import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Space, Card, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import RichTextEditor from '../../components/Editor/RichTextEditor';

const { Title } = Typography;

const EditPost = observer(() => {
  const { id } = useParams();
  const { postStore } = useStores();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const post = await postStore.fetchPostById(id);
      form.setFieldsValue({ title: post.title });
      setContent(post.content);
    } catch (error) {
      message.error('Мэдээг ачаалж чадсангүй');
      navigate('/author/posts');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await postStore.updatePost(id, {
        title: values.title,
        content: content,
      });
      message.success('Мэдээ шинэчлэгдлээ!');
      navigate('/author/posts');
    } catch (error) {
      message.error('Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Мэдээ засах
      </Title>

      <Card>
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Гарчиг"
            rules={[{ required: true, message: 'Гарчиг оруулна уу!' }]}
          >
            <Input size="large" placeholder="Мэдээний гарчиг..." />
          </Form.Item>

          <Form.Item label="Агуулга" required>
            <RichTextEditor value={content} onChange={setContent} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleUpdate} loading={loading}>
                Хадгалах
              </Button>
              <Button onClick={() => navigate('/author/posts')}>Болих</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
});

export default EditPost;


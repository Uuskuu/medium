import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import RichTextEditor from '../../components/Editor/RichTextEditor';

const { Title } = Typography;

const CreatePost = observer(() => {
  const { postStore } = useStores();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await postStore.createPost({
        title: values.title,
        content: content,
      });
      message.success('Draft хадгалагдлаа!');
      navigate('/author/posts');
    } catch (error) {
      message.error('Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const post = await postStore.createPost({
        title: values.title,
        content: content,
      });
      await postStore.submitForReview(post.id);
      message.success('Мэдээ шалгалтанд илгээгдлээ!');
      navigate('/author/posts');
    } catch (error) {
      message.error('Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Шинэ мэдээ бичих
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
              <Button type="default" onClick={handleSaveDraft} loading={loading}>
                Draft хадгалах
              </Button>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                Шалгалтанд илгээх
              </Button>
              <Button onClick={() => navigate('/author/posts')}>Болих</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
});

export default CreatePost;


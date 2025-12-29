import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import { EyeOutlined, LikeOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './PostCard.css';

const { Title, Text, Paragraph } = Typography;

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const getExcerpt = (content) => {
    try {
      const contentState = JSON.parse(content);
      const text = contentState.blocks
        .map((block) => block.text)
        .join(' ')
        .substring(0, 150);
      return text + (text.length >= 150 ? '...' : '');
    } catch (e) {
      return '';
    }
  };

  return (
    <Card
      hoverable
      className="post-card"
      onClick={() => navigate(`/posts/${post.id}`)}
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>
          {post.title}
        </Title>

        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, color: '#666' }}>
          {getExcerpt(post.content)}
        </Paragraph>

        <Space wrap>
          <Text type="secondary">
            <CalendarOutlined /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString('mn-MN')}
          </Text>
          <Text type="secondary">
            <EyeOutlined /> {post.views}
          </Text>
          <Text type="secondary">
            <LikeOutlined /> {post.likes}
          </Text>
          <Tag color="blue">{post.authorName}</Tag>
        </Space>
      </Space>
    </Card>
  );
};

export default PostCard;


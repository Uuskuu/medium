import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import { EyeOutlined, LikeOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getReadingTime } from '../../utils/readingTime';
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
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div className="post-card-meta" style={{ marginBottom: 8 }}>
          <Text className="post-card-author">{post.authorName}</Text>
          <Text type="secondary" style={{ fontSize: '13px' }}>·</Text>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('mn-MN', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
          {post.categoryName && (
            <>
              <Text type="secondary" style={{ fontSize: '13px' }}>·</Text>
              <Tag 
                style={{ 
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  color: 'rgba(0, 0, 0, 0.68)',
                  marginLeft: 4
                }}
              >
                {post.categoryName}
              </Tag>
            </>
          )}
        </div>

        <Title level={4} className="post-card-title">
          {post.title}
        </Title>

        <Paragraph ellipsis={{ rows: 2 }} className="post-card-excerpt">
          {getExcerpt(post.content)}
        </Paragraph>

        <div className="post-card-meta">
          <Text type="secondary">
            {getReadingTime(post.content)}
          </Text>
          <Text type="secondary">·</Text>
          <Text type="secondary">
            <EyeOutlined /> {post.views}
          </Text>
          <Text type="secondary">·</Text>
          <Text type="secondary">
            <LikeOutlined /> {post.likes}
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default PostCard;


import React, { useEffect, useState } from 'react';
import { Typography, Tag, Card, Space, Avatar, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../stores';
import userService from '../../services/userService';
import './Sidebar.css';

const { Title, Text } = Typography;

const Sidebar = observer(() => {
  const { categoryStore } = useStores();
  const navigate = useNavigate();
  const [topAuthors, setTopAuthors] = useState([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);

  useEffect(() => {
    categoryStore.fetchActiveCategories();
    loadTopAuthors();
  }, [categoryStore]);

  const loadTopAuthors = async () => {
    setLoadingAuthors(true);
    try {
      const authors = await userService.getTopAuthors(5);
      setTopAuthors(authors);
    } catch (error) {
      console.error('Failed to load top authors:', error);
    } finally {
      setLoadingAuthors(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/?category=${categoryId}`);
  };

  return (
    <div className="sidebar-container">
      {/* Recommended Topics */}
      <div className="sidebar-section">
        <Title level={5} className="sidebar-title">
          Recommended topics
        </Title>
        <div className="topics-container">
          {categoryStore.activeCategories.map((category) => (
            <Tag
              key={category.id}
              className="topic-tag"
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Tag>
          ))}
        </div>
        <a href="#" className="see-more-link">See more topics</a>
      </div>

      {/* Who to follow */}
      <div className="sidebar-section" style={{ marginTop: 40 }}>
        <Title level={5} className="sidebar-title">
          Who to follow
        </Title>
        {loadingAuthors ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin size="small" />
          </div>
        ) : (
          <div className="follow-list">
            {topAuthors.map((author) => (
              <div key={author.id} className="follow-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  <Avatar size={40} style={{ backgroundColor: '#1a8917' }}>
                    {author.displayName?.charAt(0).toUpperCase() || 'A'}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: 'block', fontSize: '14px' }}>
                      {author.displayName || author.username}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '13px', display: 'block' }} ellipsis>
                      {author.bio || `${author.reputationPoints || 0} reputation points`}
                    </Text>
                  </div>
                </div>
                <button className="follow-button">Follow</button>
              </div>
            ))}
            {topAuthors.length === 0 && !loadingAuthors && (
              <Text type="secondary" style={{ fontSize: '14px' }}>
                No authors to display yet
              </Text>
            )}
          </div>
        )}
      </div>

      {/* Reading List - Coming soon */}
      <div className="sidebar-section" style={{ marginTop: 40 }}>
        <Title level={5} className="sidebar-title">
          Reading list
        </Title>
        <Text type="secondary" style={{ fontSize: '14px', lineHeight: '20px' }}>
          Click the bookmark icon on any story to easily add it to your reading list or custom list that you can share.
        </Text>
      </div>

      {/* Footer Links */}
      <div className="sidebar-footer">
        <a href="#">Help</a>
        <a href="#">Status</a>
        <a href="#">About</a>
        <a href="#">Careers</a>
        <a href="#">Blog</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Text to speech</a>
        <a href="#">Teams</a>
      </div>
    </div>
  );
});

export default Sidebar;


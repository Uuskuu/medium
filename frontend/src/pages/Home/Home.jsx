import React, { useEffect, useState } from 'react';
import { Typography, Spin, Pagination, Empty, Tag } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../../components/Post/PostCard';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Home.css';

const { Title, Text } = Typography;

const Home = observer(() => {
  const { postStore, categoryStore } = useStores();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    categoryStore.fetchActiveCategories();
  }, [categoryStore]);

  useEffect(() => {
    const nextCategoryId = categoryParam || null;
    setSelectedCategory(nextCategoryId);

    if (nextCategoryId) {
      postStore.fetchApprovedPostsByCategory(nextCategoryId, 0, 10);
    } else {
      postStore.fetchApprovedPosts(0, 10);
    }
  }, [categoryParam, postStore]);

  const handlePageChange = (page, pageSize) => {
    if (selectedCategory) {
      postStore.fetchApprovedPostsByCategory(selectedCategory, page - 1, pageSize);
    } else {
      postStore.fetchApprovedPosts(page - 1, pageSize);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  // Filter posts by search query
  const filteredPosts = searchQuery
    ? postStore.posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : postStore.posts;

  return (
    <div className="home-layout">
      {/* Main Content Area */}
      <div className="home-main-content">
        {/* Category Filter */}
        {categoryStore.activeCategories.length > 0 && (
        <div style={{ 
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <Tag
            onClick={() => handleCategorySelect(null)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              borderRadius: '99em',
              cursor: 'pointer',
              border: selectedCategory === null ? '1px solid #242424' : '1px solid rgba(0, 0, 0, 0.15)',
              backgroundColor: selectedCategory === null ? '#242424' : 'transparent',
              color: selectedCategory === null ? '#ffffff' : 'rgba(0, 0, 0, 0.68)',
              marginRight: 8,
              marginBottom: 8
            }}
          >
            Бүгд
          </Tag>
          {categoryStore.activeCategories.map((category) => (
            <Tag
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                borderRadius: '99em',
                cursor: 'pointer',
                border: selectedCategory === category.id ? '1px solid #242424' : '1px solid rgba(0, 0, 0, 0.15)',
                backgroundColor: selectedCategory === category.id ? '#242424' : 'transparent',
                color: selectedCategory === category.id ? '#ffffff' : 'rgba(0, 0, 0, 0.68)',
                marginRight: 8,
                marginBottom: 8
              }}
            >
              {category.name} ({category.postCount})
            </Tag>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div>
        {searchQuery && (
          <div style={{ marginBottom: 24 }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Хайлтын үр дүн: <Text strong>"{searchQuery}"</Text> ({filteredPosts.length} мэдээ)
            </Text>
          </div>
        )}

        {postStore.loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Spin size="large" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <Empty 
            description={searchQuery ? `"${searchQuery}" хайлтад тохирох мэдээ олдсонгүй` : "Мэдээ байхгүй байна"}
            style={{ padding: '80px 0' }}
          />
        ) : (
          <>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {!searchQuery && postStore.totalPages > 1 && (
              <div style={{ textAlign: 'center', marginTop: 48, marginBottom: 32 }}>
                <Pagination
                  current={postStore.currentPage + 1}
                  total={postStore.totalPages * 10}
                  pageSize={10}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                />
              </div>
            )}
          </>
        )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="home-sidebar">
        <Sidebar />
      </aside>
    </div>
  );
});

export default Home;


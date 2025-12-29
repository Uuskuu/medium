import React, { useEffect } from 'react';
import { Typography, Spin, Pagination, Empty } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import PostCard from '../../components/Post/PostCard';

const { Title } = Typography;

const Home = observer(() => {
  const { postStore } = useStores();

  useEffect(() => {
    postStore.fetchApprovedPosts(0, 10);
  }, [postStore]);

  const handlePageChange = (page, pageSize) => {
    postStore.fetchApprovedPosts(page - 1, pageSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Нийтлэгдсэн мэдээ
      </Title>

      {postStore.loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : postStore.posts.length === 0 ? (
        <Empty description="Мэдээ байхгүй байна" />
      ) : (
        <>
          {postStore.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {postStore.totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Pagination
                current={postStore.currentPage + 1}
                total={postStore.totalPages * 10}
                pageSize={10}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default Home;


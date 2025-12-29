import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, Typography } from 'antd';
import { EyeOutlined, LikeOutlined, FileTextOutlined, PlusOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';

const { Title } = Typography;

const Dashboard = observer(() => {
  const { postStore, authStore } = useStores();
  const navigate = useNavigate();

  useEffect(() => {
    postStore.fetchMyPosts(0, 100);
  }, [postStore]);

  const totalViews = postStore.myPosts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = postStore.myPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalPosts = postStore.myPosts.length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Миний Dashboard
        </Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/author/posts/new')}>
          Шинэ мэдээ
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Нийт мэдээ"
              value={totalPosts}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Нийт үзсэн"
              value={totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Нийт таалагдсан"
              value={totalLikes}
              prefix={<LikeOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Reputation Points"
              value={authStore.user?.reputationPoints || 0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={4}>Хурдан холбоосууд</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Button block onClick={() => navigate('/author/posts/new')}>
              Шинэ мэдээ бичих
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button block onClick={() => navigate('/author/posts')}>
              Миний бүх мэдээ
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
});

export default Dashboard;


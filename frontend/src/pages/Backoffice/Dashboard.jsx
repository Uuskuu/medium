import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { UserOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, FlagOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import postService from '../../services/postService';

const { Title } = Typography;

const Dashboard = observer(() => {
  const { postStore, userStore } = useStores();
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  useEffect(() => {
    postStore.fetchPendingPosts(0, 100);
    userStore.fetchAllUsers();
    userStore.fetchAuthors();
    loadPendingReports();
  }, [postStore, userStore]);

  const loadPendingReports = async () => {
    try {
      const response = await postService.getPendingReports(0, 100);
      setPendingReportsCount(response.content?.length || 0);
    } catch (error) {
      console.error('Failed to load pending reports:', error);
    }
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Удирдлагын Dashboard
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Нийт хэрэглэгч"
              value={userStore.users.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Нийтлэгчид"
              value={userStore.authors.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Шалгалт хүлээж байна"
              value={postStore.pendingPosts.length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Нийтлэгдсэн"
              value={postStore.posts.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Мэдэгдэл хүлээж байна"
              value={pendingReportsCount}
              prefix={<FlagOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default Dashboard;


import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { UserOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';

const { Title } = Typography;

const Dashboard = observer(() => {
  const { postStore, userStore } = useStores();

  useEffect(() => {
    postStore.fetchPendingPosts(0, 100);
    userStore.fetchAllUsers();
    userStore.fetchAuthors();
  }, [postStore, userStore]);

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
      </Row>
    </div>
  );
});

export default Dashboard;


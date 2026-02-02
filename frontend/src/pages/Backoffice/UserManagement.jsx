import React, { useEffect } from 'react';
import { Table, Tag, Typography, Card } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';

const { Title } = Typography;

const UserManagement = observer(() => {
  const { userStore } = useStores();

  useEffect(() => {
    userStore.fetchAllUsers();
  }, [userStore]);

  const getRoleTag = (role) => {
    const roleConfig = {
      ADMIN: { color: 'red', text: 'Админ' },
      AUTHOR: { color: 'blue', text: 'Нийтлэгч' },
      READER: { color: 'default', text: 'Уншигч' },
    };
    const config = roleConfig[role] || { color: 'default', text: role };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: '№',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_value, _record, index) => index + 1,
    },
    {
      title: 'Хэрэглэгчийн нэр',
      dataIndex: 'username',
      key: 'username',
      align: 'center'
    },
    {
      title: 'Дэлгэцийн нэр',
      dataIndex: 'displayName',
      key: 'displayName',
      align: 'center'
    },
    {
      title: 'Имэйл',
      dataIndex: 'email',
      key: 'email',
      align: 'center'
    },
    {
      title: 'Дүр',
      dataIndex: 'role',
      key: 'role',
      render: (role) => getRoleTag(role),
      align: 'center'
    },
    {
      title: 'Reputation Points',
      dataIndex: 'reputationPoints',
      key: 'reputationPoints',
      align: 'center',
      render: (points) => (
        <span>
          <TrophyOutlined style={{ color: '#faad14', marginRight: 4 }} />
          {points}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Хэрэглэгчдийн удирдлага
      </Title>

      <Table
        columns={columns}
        dataSource={userStore.users}
        rowKey="id"
        loading={userStore.loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
});

export default UserManagement;


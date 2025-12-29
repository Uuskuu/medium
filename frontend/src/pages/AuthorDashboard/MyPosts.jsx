import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Typography, Popconfirm, message, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';

const { Title } = Typography;

const MyPosts = observer(() => {
  const { postStore } = useStores();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (activeTab === 'all') {
      postStore.fetchMyPosts(0, 100);
    } else {
      postStore.fetchMyPostsByStatus(activeTab);
    }
  }, [activeTab, postStore]);

  const handleDelete = async (id) => {
    try {
      await postStore.deletePost(id);
      message.success('Мэдээ устгагдлаа');
    } catch (error) {
      message.error('Алдаа гарлаа');
    }
  };

  const handleSubmitForReview = async (id) => {
    try {
      await postStore.submitForReview(id);
      message.success('Шалгалтанд илгээгдлээ!');
      postStore.fetchMyPosts(0, 100);
    } catch (error) {
      message.error(error.response?.data?.message || 'Алдаа гарлаа');
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      DRAFT: { color: 'default', text: 'Draft' },
      PENDING_REVIEW: { color: 'processing', text: 'Хүлээгдэж байна' },
      APPROVED: { color: 'success', text: 'Нийтлэгдсэн' },
      REJECTED: { color: 'error', text: 'Буцаагдсан' },
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Гарчиг',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Үзсэн',
      dataIndex: 'views',
      key: 'views',
      align: 'center',
    },
    {
      title: 'Таалагдсан',
      dataIndex: 'likes',
      key: 'likes',
      align: 'center',
    },
    {
      title: 'Огноо',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('mn-MN'),
    },
    {
      title: 'Үйлдэл',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'APPROVED' && (
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/posts/${record.id}`)}
            />
          )}
          {(record.status === 'DRAFT' || record.status === 'REJECTED') && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => navigate(`/author/posts/${record.id}/edit`)}
              />
              <Button
                type="link"
                icon={<SendOutlined />}
                onClick={() => handleSubmitForReview(record.id)}
              />
            </>
          )}
          <Popconfirm
            title="Устгах уу?"
            description="Энэ мэдээг устгахдаа итгэлтэй байна уу?"
            onConfirm={() => handleDelete(record.id)}
            okText="Тийм"
            cancelText="Үгүй"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: 'all', label: 'Бүгд' },
    { key: 'APPROVED', label: 'Нийтлэгдсэн' },
    { key: 'PENDING_REVIEW', label: 'Хүлээгдэж байна' },
    { key: 'DRAFT', label: 'Draft' },
    { key: 'REJECTED', label: 'Буцаагдсан' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Миний мэдээ
        </Title>
        <Button type="primary" onClick={() => navigate('/author/posts/new')}>
          Шинэ мэдээ
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      <Table
        columns={columns}
        dataSource={postStore.myPosts}
        rowKey="id"
        loading={postStore.loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
});

export default MyPosts;


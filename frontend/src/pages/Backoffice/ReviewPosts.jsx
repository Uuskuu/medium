import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Modal, Input, message, Card, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import PostContent from '../../components/Post/PostContent';

const { Title } = Typography;
const { TextArea } = Input;

const ReviewPosts = observer(() => {
  const { postStore } = useStores();
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewAction, setReviewAction] = useState(null);

  useEffect(() => {
    postStore.fetchReviewPosts(0, 100);
  }, [postStore]);

  const handleView = (post) => {
    setSelectedPost(post);
    setViewModalVisible(true);
  };

  const handleApprove = (post) => {
    setSelectedPost(post);
    setReviewAction('approve');
    setReviewModalVisible(true);
  };

  const handleReject = (post) => {
    setSelectedPost(post);
    setReviewAction('reject');
    setReviewModalVisible(true);
  };

  const handleReviewSubmit = async () => {
    try {
      if (reviewAction === 'approve') {
        await postStore.approvePost(selectedPost.id, reviewNote);
        message.success('Мэдээ зөвшөөрөгдлөө!');
      } else {
        if (!reviewNote.trim()) {
          message.warning('Буцаах шалтгааныг оруулна уу');
          return;
        }
        await postStore.rejectPost(selectedPost.id, reviewNote);
        message.success('Мэдээ буцаагдлаа');
      }
      setReviewModalVisible(false);
      setReviewNote('');
      setSelectedPost(null);
    } catch (error) {
      message.error('Алдаа гарлаа');
    }
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
      title: 'Гарчиг',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'APPROVED') return <Tag color="green">Зөвшөөрсөн</Tag>;
        if (status === 'PENDING_REVIEW') return <Tag color="gold">Хянагдаж байна</Tag>;
        if (status === 'REJECTED') return <Tag color="red">Буцаасан</Tag>;
        if (status === 'DRAFT') return <Tag>Ноорог</Tag>;
        return <Tag>{status || '-'}</Tag>;
      },
    },
    {
      title: 'Зохиогч',
      dataIndex: 'authorName',
      key: 'authorName',
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
        (() => {
          const canReview = record.status === 'PENDING_REVIEW';
          return (
        <Space size="small">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            Харах
          </Button>
          <Button
            type="link"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record)}
            disabled={!canReview}
          >
            Зөвшөөрөх
          </Button>
          <Button
            type="link"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleReject(record)}
            disabled={!canReview}
          >
            Буцаах
          </Button>
        </Space>
          );
        })()
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Мэдээ шалгах
      </Title>

      <Table
        columns={columns}
        dataSource={postStore.reviewPosts}
        rowKey="id"
        loading={postStore.loading}
        pagination={{ pageSize: 10 }}
      />

      {/* View Modal */}
      <Modal
        title="Мэдээ шалгах"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Хаах
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => handleApprove(selectedPost)}
            disabled={selectedPost?.status !== 'PENDING_REVIEW'}
          >
            Зөвшөөрөх
          </Button>,
          <Button
            key="reject"
            danger
            onClick={() => handleReject(selectedPost)}
            disabled={selectedPost?.status !== 'PENDING_REVIEW'}
          >
            Буцаах
          </Button>,
        ]}
        width={900}
      >
        {selectedPost && (
          <div>
            <Title level={3}>{selectedPost.title}</Title>
            <p>
              <strong>Зохиогч:</strong> {selectedPost.authorName}
            </p>
            <p>
              <strong>Огноо:</strong> {new Date(selectedPost.createdAt).toLocaleString('mn-MN')}
            </p>
            <Card style={{ marginTop: 16 }}>
              <PostContent content={selectedPost.content} />
            </Card>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        title={reviewAction === 'approve' ? 'Мэдээ зөвшөөрөх' : 'Мэдээ буцаах'}
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          setReviewNote('');
        }}
        onOk={handleReviewSubmit}
        okText={reviewAction === 'approve' ? 'Зөвшөөрөх' : 'Буцаах'}
        cancelText="Болих"
      >
        <TextArea
          rows={4}
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
          placeholder={
            reviewAction === 'approve'
              ? 'Тайлбар (заавал биш)'
              : 'Буцаах шалтгааныг бичнэ үү...'
          }
        />
      </Modal>
    </div>
  );
});

export default ReviewPosts;


import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Typography, Modal, Input, message, Select, Tabs } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import postService from '../../services/postService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ReportManagement = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewStatus, setReviewStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    loadReports();
  }, [activeTab]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'all' 
        ? await postService.getAllReports(0, 100)
        : await postService.getPendingReports(0, 100);
      setReports(response.content || response);
    } catch (error) {
      message.error('Мэдэгдлүүдийг ачаалахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (report, status) => {
    setSelectedReport(report);
    setReviewStatus(status);
    setReviewModalVisible(true);
  };

  const submitReview = async () => {
    if (!reviewNote.trim() && reviewStatus !== 'DISMISSED') {
      message.warning('Тайлбар оруулна уу');
      return;
    }

    try {
      await postService.reviewReport(selectedReport.id, reviewStatus, reviewNote);
      message.success('Мэдэгдэл шийдэгдлээ');
      setReviewModalVisible(false);
      setReviewNote('');
      setSelectedReport(null);
      loadReports();
    } catch (error) {
      message.error('Алдаа гарлаа');
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: { color: 'processing', text: 'Хүлээгдэж байна' },
      REVIEWED: { color: 'default', text: 'Шалгасан' },
      ACTION_TAKEN: { color: 'success', text: 'Арга хэмжээ авсан' },
      DISMISSED: { color: 'default', text: 'Хаягдсан' },
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getReasonText = (reason) => {
    const reasons = {
      SPAM: 'Спам',
      HARASSMENT: 'Дарамт, доромжлол',
      FALSE_INFORMATION: 'Худал мэдээлэл',
      INAPPROPRIATE_CONTENT: 'Зохисгүй контент',
      COPYRIGHT_VIOLATION: 'Зохиогчийн эрх зөрчсөн',
      OTHER: 'Бусад',
    };
    return reasons[reason] || reason;
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
      title: 'Мэдээ',
      dataIndex: 'postTitle',
      key: 'postTitle',
      width: '30%',
      render: (title, record) => (
        <a onClick={() => navigate(`/posts/${record.postId}`)}>
          {title}
        </a>
      ),
    },
    {
      title: 'Шалтгаан',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => getReasonText(reason),
    },
    {
      title: 'Тайлбар',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Мэдэгдсэн',
      dataIndex: 'reportedByUsername',
      key: 'reportedByUsername',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
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
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/posts/${record.postId}`)}
          />
          {record.status === 'PENDING' && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleReview(record, 'ACTION_TAKEN')}
                style={{ color: '#1a8917' }}
              />
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={() => handleReview(record, 'DISMISSED')}
                danger
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: 'pending', label: 'Хүлээгдэж байна' },
    { key: 'all', label: 'Бүгд' },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Мэдэгдлийн удирдлага
      </Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      <Table
        columns={columns}
        dataSource={reports}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={`Мэдэгдлийг ${reviewStatus === 'ACTION_TAKEN' ? 'баталгаажуулах' : 'татгалзах'}`}
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          setReviewNote('');
          setSelectedReport(null);
        }}
        onOk={submitReview}
        okText="Батлах"
        cancelText="Болих"
      >
        {selectedReport && (
          <div>
            <Paragraph>
              <Text strong>Мэдээ:</Text> {selectedReport.postTitle}
            </Paragraph>
            <Paragraph>
              <Text strong>Шалтгаан:</Text> {getReasonText(selectedReport.reason)}
            </Paragraph>
            <Paragraph>
              <Text strong>Тайлбар:</Text> {selectedReport.description}
            </Paragraph>
            <Paragraph>
              <Text strong>Мэдэгдсэн:</Text> {selectedReport.reportedByUsername}
            </Paragraph>

            <TextArea
              rows={4}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder={reviewStatus === 'ACTION_TAKEN' 
                ? 'Авсан арга хэмжээний талаар тайлбар...'
                : 'Татгалзсан шалтгаан...'
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportManagement;


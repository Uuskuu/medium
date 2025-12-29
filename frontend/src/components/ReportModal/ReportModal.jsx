import React, { useState } from 'react';
import { Modal, Form, Select, Input, message } from 'antd';
import postService from '../../services/postService';

const { TextArea } = Input;

const ReportModal = ({ visible, onClose, postId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: 'SPAM', label: 'Спам' },
    { value: 'HARASSMENT', label: 'Дарамт, доромжлол' },
    { value: 'FALSE_INFORMATION', label: 'Худал мэдээлэл' },
    { value: 'INAPPROPRIATE_CONTENT', label: 'Зохисгүй контент' },
    { value: 'COPYRIGHT_VIOLATION', label: 'Зохиогчийн эрх зөрчсөн' },
    { value: 'OTHER', label: 'Бусад' },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await postService.reportPost(postId, values.reason, values.description);
      message.success('Мэдэгдэл амжилттай илгээгдлээ');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('Мэдэгдэл илгээхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Мэдээг мэдэгдэх"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Илгээх"
      cancelText="Болих"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="Шалтгаан"
          rules={[{ required: true, message: 'Шалтгаан сонгоно уу!' }]}
        >
          <Select placeholder="Шалтгаан сонгох">
            {reasons.map((reason) => (
              <Select.Option key={reason.value} value={reason.value}>
                {reason.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Тайлбар"
          rules={[{ required: true, message: 'Тайлбар оруулна уу!' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Асуудлын талаар дэлгэрэнгүй бичнэ үү..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportModal;


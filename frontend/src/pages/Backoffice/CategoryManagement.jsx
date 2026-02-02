import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Typography, Modal, Form, Input, message, Switch, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CategoryManagement = observer(() => {
  const { categoryStore } = useStores();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    categoryStore.fetchAllCategories();
  }, [categoryStore]);

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      iconUrl: category.iconUrl,
      displayOrder: category.displayOrder,
      active: category.active,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await categoryStore.deleteCategory(id);
      message.success('Категори устгагдлаа');
    } catch (error) {
      message.error(error.message || 'Алдаа гарлаа');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await categoryStore.updateCategory(editingCategory.id, values);
        message.success('Категори шинэчлэгдлээ');
      } else {
        await categoryStore.createCategory(values);
        message.success('Категори үүсгэгдлээ');
      }
      setModalVisible(false);
      form.resetFields();
      categoryStore.fetchAllCategories();
    } catch (error) {
      message.error(error.message || 'Алдаа гарлаа');
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
      title: 'Нэр',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Text strong>{name}</Text>
          <Tag color={record.active ? 'success' : 'default'}>
            {record.active ? 'Идэвхтэй' : 'Идэвхгүй'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => <Text type="secondary">{slug}</Text>,
    },
    {
      title: 'Тайлбар',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Дараалал',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      align: 'center',
      width: 100,
    },
    {
      title: 'Мэдээний тоо',
      dataIndex: 'postCount',
      key: 'postCount',
      align: 'center',
      width: 120,
    },
    {
      title: 'Үүсгэсэн',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('mn-MN'),
      width: 120,
    },
    {
      title: 'Үйлдэл',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Устгах уу?',
                content: `"${record.name}" категорийг устгахдаа итгэлтэй байна уу?`,
                okText: 'Тийм',
                cancelText: 'Үгүй',
                onOk: () => handleDelete(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Категори удирдлага
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Категори нэмэх
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categoryStore.categories}
        rowKey="id"
        loading={categoryStore.loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingCategory ? 'Категори засах' : 'Категори нэмэх'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        onOk={handleSubmit}
        okText={editingCategory ? 'Хадгалах' : 'Үүсгэх'}
        cancelText="Болих"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Категорийн нэр"
            rules={[{ required: true, message: 'Нэр оруулна уу!' }]}
          >
            <Input placeholder="жишээ нь: Technology, Politics" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Тайлбар"
          >
            <TextArea rows={3} placeholder="Категорийн тайлбар..." />
          </Form.Item>

          <Form.Item
            name="iconUrl"
            label="Icon URL (заавал биш)"
          >
            <Input placeholder="https://example.com/icon.png" />
          </Form.Item>

          <Form.Item
            name="displayOrder"
            label="Дараалал"
            initialValue={0}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="active"
            label="Идэвхтэй эсэх"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default CategoryManagement;


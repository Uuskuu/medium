import React, { useState } from 'react';
import { Table, Button, DatePicker, Space, Typography, message, Card } from 'antd';
import { CalculatorOutlined, FileTextOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import dayjs from 'dayjs';

const { Title } = Typography;
const { MonthPicker } = DatePicker;

const SalaryManagement = observer(() => {
  const { userStore } = useStores();
  const [selectedMonth, setSelectedMonth] = useState(dayjs().subtract(1, 'month'));
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const monthStr = selectedMonth.format('YYYY-MM');
      await userStore.calculateSalaries(monthStr);
      message.success('Цалин тооцоолж дууслаа!');
      await handleFetchReport();
    } catch (error) {
      message.error('Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchReport = async () => {
    setLoading(true);
    try {
      const monthStr = selectedMonth.format('YYYY-MM');
      await userStore.fetchSalaryReport(monthStr);
    } catch (error) {
      message.error('Тайлан ачаалж чадсангүй');
    } finally {
      setLoading(false);
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
      title: 'Author ID',
      dataIndex: 'authorId',
      key: 'authorId',
    },
    {
      title: 'Reputation Points',
      dataIndex: 'reputationPoints',
      key: 'reputationPoints',
      align: 'center',
    },
    {
      title: 'Нийт үзсэн',
      dataIndex: 'totalViews',
      key: 'totalViews',
      align: 'center',
    },
    {
      title: 'Нийт таалагдсан',
      dataIndex: 'totalLikes',
      key: 'totalLikes',
      align: 'center',
    },
    {
      title: 'Цалин (₮)',
      dataIndex: 'calculatedAmount',
      key: 'calculatedAmount',
      align: 'right',
      render: (amount) => amount?.toLocaleString('mn-MN') + ' ₮',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Цалингийн удирдлага
      </Title>

      <Card style={{ marginBottom: 24 }}>
        <Space>
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            format="YYYY-MM"
          />
          <Button
            type="primary"
            icon={<CalculatorOutlined />}
            onClick={handleCalculate}
            loading={loading}
          >
            Цалин тооцоолох
          </Button>
          <Button icon={<FileTextOutlined />} onClick={handleFetchReport} loading={loading}>
            Тайлан харах
          </Button>
        </Space>
      </Card>

      <Card>
        <Title level={4}>
          {selectedMonth.format('YYYY-MM')} сарын цалингийн тайлан
        </Title>
        <Table
          columns={columns}
          dataSource={userStore.salaryRecords}
          rowKey="id"
          loading={userStore.loading}
          pagination={{ pageSize: 10 }}
          summary={(pageData) => {
            let totalAmount = 0;
            pageData.forEach(({ calculatedAmount }) => {
              totalAmount += calculatedAmount || 0;
            });

            return (
              <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5}>
                  <strong>Нийт дүн</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <strong>{totalAmount.toLocaleString('mn-MN')} ₮</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
});

export default SalaryManagement;


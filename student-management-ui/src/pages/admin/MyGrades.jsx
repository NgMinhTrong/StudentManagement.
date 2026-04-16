import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Typography, Space, Row, Col, Statistic } from 'antd';
import { SolutionOutlined, BookOutlined, RiseOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';

const { Title, Text } = Typography;

const MyGrades = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyGrades = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/Scores/student/${user.id}`);
        setScores(res.data);
      } catch (err) {
        console.error('Lỗi khi tải điểm');
      } finally {
        setLoading(false);
      }
    };
    fetchMyGrades();
  }, [user.id]);

  const avgTotal = scores.length > 0 
    ? (scores.reduce((acc, curr) => acc + (curr.averageScore || 0), 0) / scores.length).toFixed(2)
    : '0.00';

  const columns = [
    { title: 'Môn học', dataIndex: 'subjectName', key: 'subjectName', width: 250 },
    { title: 'Học kỳ', dataIndex: 'semester', key: 'semester', width: 100 },
    { title: 'Điểm 15P', dataIndex: 'score15Min', key: 'score15Min' },
    { title: 'Điểm 45P', dataIndex: 'score45Min', key: 'score45Min' },
    { title: 'Cuối kỳ', dataIndex: 'scoreFinal', key: 'scoreFinal' },
    { 
      title: 'ĐTB Môn', 
      dataIndex: 'averageScore', 
      key: 'averageScore',
      render: (val) => <Tag color={val >= 5 ? 'blue' : 'volcano'}>{val?.toFixed(2) || 'N/A'}</Tag>
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', animation: 'fadeIn 0.5s' }}>
      <Card bordered={false}>
        <Row gutter={16} align="middle">
          <Col span={16}>
            <Title level={3} style={{ margin: 0 }}>Kết quả học tập cá nhân</Title>
            <Text type="secondary">Chào học sinh: <Text strong>{user.fullName}</Text></Text>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Card size="small" style={{ background: '#e6f7ff', border: 'none' }}>
              <Statistic 
                title="Điểm trung bình học kỳ (Tạm tính)" 
                value={avgTotal} 
                precision={2} 
                prefix={<RiseOutlined />} 
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title={<Space><BookOutlined /> Bảng điểm chi tiết</Space>} bordered={false}>
        <Table 
          columns={columns} 
          dataSource={scores} 
          rowKey="id" 
          loading={loading}
          bordered
          pagination={false}
        />
      </Card>
    </Space>
  );
};

export default MyGrades;

import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Typography, Space, Row, Col, Statistic, Select, Tooltip } from 'antd';
import { BookOutlined, RiseOutlined, CommentOutlined, UserOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const MyGrades = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [semester, setSemester] = useState('All');

  const fetchMyGrades = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/Scores/student/${user.id}`);
      setScores(res.data);
    } catch (err) {
      console.error('Lỗi khi tải điểm', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGrades();
  }, [user.id]);

  const filteredScores = semester === 'All' 
    ? scores 
    : scores.filter(s => s.semester === semester);

  const avgTotal = filteredScores.length > 0 
    ? (filteredScores.reduce((acc, curr) => acc + (curr.averageScore || 0), 0) / filteredScores.length).toFixed(2)
    : '0.00';

  const renderScore = (val) => {
    if (val === null || val === undefined) return <Text type="secondary" italic>Đang cập nhật</Text>;
    return val;
  };

  const columns = [
    { 
      title: 'Môn học', 
      key: 'subject',
      width: 250,
      render: (row) => (
        <div>
          <Text strong>{row.subjectName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            <UserOutlined /> GV: {row.teacherName}
          </Text>
        </div>
      )
    },
    { title: 'Học kỳ', dataIndex: 'semester', key: 'semester', width: 100 },
    { 
      title: 'Miệng/15P', 
      dataIndex: 'score15Min', 
      key: 'score15Min',
      render: renderScore
    },
    { 
      title: '45P', 
      dataIndex: 'score45Min', 
      key: 'score45Min',
      render: renderScore
    },
    { 
      title: 'Cuối kỳ', 
      dataIndex: 'scoreFinal', 
      key: 'scoreFinal',
      render: renderScore
    },
    { 
      title: 'ĐTB Môn', 
      dataIndex: 'averageScore', 
      key: 'averageScore',
      render: (val) => <Tag color={val >= 5 ? 'blue' : 'volcano'}>{val > 0 ? val.toFixed(2) : 'N/A'}</Tag>
    },
    {
      title: 'Lời phê',
      dataIndex: 'teacherRemarks',
      key: 'teacherRemarks',
      render: (text) => (
        <Tooltip title={text || "Chưa có nhận xét"}>
          <div style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {text ? <><CommentOutlined /> {text}</> : <Text type="secondary">--</Text>}
          </div>
        </Tooltip>
      )
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', animation: 'fadeIn 0.5s' }}>
      <Card variant="borderless">
        <Row gutter={16} align="middle">
          <Col xs={24} md={12}>
            <Title level={3} style={{ margin: 0 }}>Kết quả học tập cá nhân</Title>
            <Text type="secondary">Chào học sinh: <Text strong>{user.fullName}</Text></Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space size="middle">
              <Select defaultValue="All" style={{ width: 150 }} onChange={setSemester}>
                <Option value="All">Tất cả học kỳ</Option>
                <Option value="1">Học kỳ 1</Option>
                <Option value="2">Học kỳ 2</Option>
              </Select>
              <Card size="small" style={{ background: '#e6f7ff', border: 'none', display: 'inline-block' }}>
                <Statistic 
                  title="ĐTB Học kỳ" 
                  value={avgTotal} 
                  precision={2} 
                  prefix={<RiseOutlined />} 
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title={<Space><BookOutlined /> Bảng điểm chi tiết</Space>} variant="borderless">
        <Table 
          columns={columns} 
          dataSource={filteredScores} 
          rowKey="id" 
          loading={loading}
          bordered
          pagination={false}
          scroll={{ x: 800 }} // Support mobile horizontal scroll
        />
      </Card>
    </Space>
  );
};

export default MyGrades;

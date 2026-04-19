import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Tag, Empty } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';

const { Title, Text } = Typography;

const WeeklySchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, we'd fetch actual time slots. 
    // For now, we fetch assigned subjects for the student's class.
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        // Find the student's class ID first
        const studentRes = await api.get(`/Students/${user.id}`);
        const classId = studentRes.data.classId;
        
        const res = await api.get(`/TeachingAssignments`);
        const myClassAssignments = res.data.filter(ta => ta.classId === classId);
        setSchedule(myClassAssignments);
      } catch (err) {
        console.error('Failed to fetch schedule', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [user.id]);

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  
  const columns = [
    { title: 'Tiết', dataIndex: 'period', key: 'period', width: 80, fixed: 'left' },
    ...days.map(day => ({
      title: day,
      key: day,
      render: (row) => {
        // Mocking logic to distribute subjects randomly for demo
        const subject = schedule[Math.floor(Math.random() * schedule.length)];
        if (!subject || Math.random() > 0.7) return null;
        
        return (
          <div style={{ padding: 8, background: '#f0f5ff', borderRadius: 4, borderLeft: '4px solid #1890ff' }}>
            <Text strong style={{ fontSize: 13, display: 'block' }}>{subject.subjectName}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              <EnvironmentOutlined /> Tầng 2 - P.201
            </Text>
          </div>
        );
      }
    }))
  ];

  const data = [
    { key: '1', period: 'Tiết 1' },
    { key: '2', period: 'Tiết 2' },
    { key: '3', period: 'Tiết 3' },
    { key: '4', period: 'Tiết 4' },
    { key: '5', period: 'Tiết 5' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card variant="borderless">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0 }}>Thời khóa biểu</Title>
              <Text type="secondary">Học kỳ 2 | Năm học 2024-2025</Text>
            </Col>
            <Col>
              <Tag color="blue" icon={<CalendarOutlined />}>Tuần hiện tại</Tag>
            </Col>
          </Row>
        </Card>

        <Card variant="borderless" bodyStyle={{ padding: 0 }}>
          <Table 
            columns={columns} 
            dataSource={data} 
            pagination={false} 
            bordered 
            loading={loading}
            scroll={{ x: 1000 }}
          />
        </Card>

        <Card variant="borderless">
          <Title level={5}>Lưu ý:</Title>
          <ul>
            <li>Học sinh có mặt tại phòng học trước 15 phút.</li>
            <li>Mang đầy đủ sách vở và dụng cụ học tập theo môn học.</li>
            <li>Lịch học có thể thay đổi tùy theo thông báo của Nhà trường.</li>
          </ul>
        </Card>
      </Space>
    </div>
  );
};

// Layout fix for row/col used inside
import { Row, Col } from 'antd';

export default WeeklySchedule;

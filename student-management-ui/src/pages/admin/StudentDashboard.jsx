import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Progress, 
  Typography, 
  List, 
  Badge, 
  Avatar, 
  Space, 
  Statistic 
} from 'antd';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  RiseOutlined, 
  NotificationOutlined, 
  TrophyOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';

const { Title, Text } = Typography;

const StudentDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    gpa: 0,
    rank: 0,
    totalInGrade: 0,
    notifications: []
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, chartRes] = await Promise.all([
          api.get(`/StudentDashboard/summary/${user.studentId}`),
          api.get(`/StudentDashboard/performance-chart/${user.studentId}`)
        ]);
        setSummary(sumRes.data);
        setChartData(chartRes.data);
      } catch (err) {
        console.error('Failed to fetch student dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.studentId]);

  return (
    <div className="animate-in fade-in duration-500">
      <Row gutter={[24, 24]}>
        {/* GPA & Rank Section */}
        <Col xs={24} md={8}>
          <Card variant="borderless" style={{ height: '100%', textAlign: 'center' }}>
            <Title level={4}>Kết quả học tập</Title>
            <div style={{ margin: '24px 0' }}>
              <Progress 
                type="dashboard" 
                percent={summary.gpa * 10} 
                format={() => summary.gpa} 
                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                size={200}
              />
            </div>
            <Text type="secondary">Điểm trung bình (GPA)</Text>
            
            <div style={{ marginTop: 32 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic 
                    title="Xếp hạng" 
                    value={summary.rank} 
                    suffix={`/ ${summary.totalInGrade}`}
                    prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Tiến độ" 
                    value={Math.round((summary.gpa / 10) * 100)} 
                    suffix="%" 
                    prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                  />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        {/* Learning Chart Section */}
        <Col xs={24} md={16}>
          <Card title="Biểu đồ tiến trình học tập" variant="borderless" style={{ height: '100%' }}>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avg" 
                    stroke="#1890ff" 
                    strokeWidth={3} 
                    dot={{ r: 6 }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Notifications & Schedule Summary */}
        <Col xs={24} md={12}>
          <Card 
            title={<Space><NotificationOutlined /> Thông báo & Cập nhật điểm</Space>} 
            variant="borderless"
            extra={<a href="#">Xem tất cả</a>}
          >
            <List
              dataSource={summary.notifications}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Badge dot color={item.isRead ? 'transparent' : 'blue'}><Avatar icon={<NotificationOutlined />} /></Badge>}
                    title={item.title}
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.message}</span>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title={<Space><CalendarOutlined /> Lịch học hôm nay</Space>} variant="borderless">
            <List
              itemLayout="horizontal"
              dataSource={[
                { time: '07:30 - 09:00', subject: 'Toán học', room: 'P.102', teacher: 'Lê Văn Tú' },
                { time: '09:15 - 10:45', subject: 'Vật lí', room: 'P.102', teacher: 'Nguyễn Minh Anh' },
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.subject}</Text>}
                    description={`${item.time} | ${item.room} | GV: ${item.teacher}`}
                  />
                  <Tag color="processing">Sắp diễn ra</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;

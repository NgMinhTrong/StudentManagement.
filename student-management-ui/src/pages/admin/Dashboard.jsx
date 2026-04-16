import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, List, Avatar } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined, 
  ReadOutlined,
  ArrowUpOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import api from '../../api/axios';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/Dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Tổng số sinh viên', value: stats.totalStudents, icon: <TeamOutlined />, color: '#1890ff' },
    { title: 'Tổng số giáo viên', value: stats.totalTeachers, icon: <UserOutlined />, color: '#722ed1' },
    { title: 'Số lượng lớp học', value: stats.totalClasses, icon: <BookOutlined />, color: '#fa8c16' },
    { title: 'Số lượng môn học', value: stats.totalSubjects, icon: <ReadOutlined />, color: '#13c2c2' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card bordered={false} style={{ marginBottom: 16 }}>
            <Title level={3}>Dashboard Quản trị</Title>
            <Text type="secondary">Tổng quan dữ liệu toàn hệ thống Student Management</Text>
          </Card>
        </Col>
        
        {statCards.map((c, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} hoverable>
              <Statistic
                title={c.title}
                value={c.value}
                valueStyle={{ color: c.color, fontWeight: 'bold' }}
                prefix={c.icon}
                suffix={<ArrowUpOutlined style={{ fontSize: 12, marginLeft: 8 }} />}
              />
              <div style={{ marginTop: 8 }}>
                <Tag color="green">+4% so với tháng trước</Tag>
              </div>
            </Card>
          </Col>
        ))}

        <Col xs={24} lg={16}>
          <Card title="Giao dịch/Hoạt động gần đây" bordered={false} extra={<a href="#">Xem tất cả</a>}>
            <List
              itemLayout="horizontal"
              dataSource={[
                { title: 'Cập nhật điểm môn Toán', desc: 'GV Lê Văn Tú vừa cập nhật điểm cho lớp 10A1', time: '5 phút trước' },
                { title: 'Thêm tài khoản mới', desc: 'Admin vừa cấp tài khoản cho sinh viên mới Trần Văn An', time: '1 giờ trước' },
                { title: 'Phân công giảng dạy', desc: 'Môn Hóa học đã được phân công cho cô Lan', time: '2 giờ trước' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<GlobalOutlined />} style={{ backgroundColor: '#f56a00' }} />}
                    title={item.title}
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.desc}</span>
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Tỷ lệ học lực (Mẫu)" bordered={false}>
            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Text type="secondary" italic>Pie Chart Placeholder</Text>
            </div>
            <div style={{ marginTop: 16 }}>
              <Row gutter={[8, 8]}>
                <Col span={12}><Tag color="blue">Giỏi: 24%</Tag></Col>
                <Col span={12}><Tag color="green">Khá: 45%</Tag></Col>
                <Col span={12}><Tag color="orange">Trung bình: 28%</Tag></Col>
                <Col span={12}><Tag color="red">Yếu: 3%</Tag></Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

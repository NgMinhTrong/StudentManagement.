import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Typography, Divider, Tag, Descriptions, Space, Badge } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';

const { Title, Text } = Typography;

const StudentProfile = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/Students/${user.id}`);
        setStudent(res.data);
      } catch (err) {
        console.error('Failed to fetch student profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <Row gutter={[24, 24]}>
        {/* Profile Card */}
        <Col xs={24} md={8}>
          <Card variant="borderless" style={{ textAlign: 'center' }}>
            <Avatar size={120} icon={<UserOutlined />} src={null} style={{ backgroundColor: '#1890ff', marginBottom: 16 }} />
            <Title level={3} style={{ marginBottom: 0 }}>{student?.fullName}</Title>
            <Text type="secondary">MSSV: {student?.studentCode}</Text>
            <div style={{ marginTop: 12 }}>
              <Tag color="blue">{student?.className}</Tag>
              <Tag color="green">Đang học</Tag>
            </div>
            
            <Divider />
            
            <div style={{ textAlign: 'left' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text><MailOutlined style={{ marginRight: 8 }} /> {student?.email}</Text>
                <Text><HomeOutlined style={{ marginRight: 8 }} /> {student?.birthPlace || 'Chưa cập nhật'}</Text>
              </Space>
            </div>
          </Card>
        </Col>

        {/* Details Section */}
        <Col xs={24} md={16}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title={<Space><UserOutlined /> Thông tin cá nhân</Space>} variant="borderless">
              <Descriptions column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="Họ và tên">{student?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Mã sinh viên">{student?.studentCode}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{new Date(student?.birthday).toLocaleDateString('vi-VN')}</Descriptions.Item>
                <Descriptions.Item label="Nơi sinh">{student?.birthPlace || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Lớp">{student?.className}</Descriptions.Item>
                <Descriptions.Item label="Khối">{student?.className?.substring(0, 2)}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title={<Space><SafetyCertificateOutlined /> Thông tin phụ huynh</Space>} variant="borderless">
              <Descriptions column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="Họ tên Cha/Mẹ">{student?.parentName || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại"><PhoneOutlined /> {student?.parentPhone || 'Chưa cập nhật'}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Tình trạng học phí" variant="borderless">
              <Badge.Ribbon text="Đã hoàn thành" color="green">
                <div style={{ padding: '20px 0' }}>
                  <Text strong>Học kỳ 1 - Năm học 2024-2025</Text>
                  <br />
                  <Text type="secondary">Ngày đóng: 15/01/2026</Text>
                </div>
              </Badge.Ribbon>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default StudentProfile;

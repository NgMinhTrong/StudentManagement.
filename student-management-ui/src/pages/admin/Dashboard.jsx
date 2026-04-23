import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    Statistic,
    Typography,
    Table,
    Tag,
    List,
    Avatar,
    Spin,
} from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    BookOutlined,
    ReadOutlined,
    ArrowUpOutlined,
    GlobalOutlined,
    UserSwitchOutlined,
    FileTextOutlined,
    CalendarOutlined,
    BellOutlined,
    SafetyOutlined,
} from '@ant-design/icons';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        totalSubjects: 0,
        totalUsers: 0,
        totalScores: 0,
        totalAssignments: 0,
        totalNotifications: 0,
        totalRoles: 0,
        recentActivities: [],
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/Dashboard/stats');
                // Đảm bảo recentActivities luôn là mảng để không lỗi .map()
                setStats({
                    ...res.data,
                    recentActivities: res.data.recentActivities || [],
                });
            } catch (err) {
                console.error('Failed to fetch stats', err);
                // Nếu lỗi 401, thường do axios interceptor sẽ xử lý logout,
                // ở đây ta chỉ log lỗi.
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Sinh viên',
            value: stats.totalStudents,
            icon: <TeamOutlined />,
            color: '#1890ff',
            link: '/admin/students',
        },
        {
            title: 'Giáo viên',
            value: stats.totalTeachers,
            icon: <UserOutlined />,
            color: '#722ed1',
            link: '/admin/teachers',
        },
        {
            title: 'Lớp học',
            value: stats.totalClasses,
            icon: <BookOutlined />,
            color: '#fa8c16',
            link: '/admin/classes',
        },
        {
            title: 'Môn học',
            value: stats.totalSubjects,
            icon: <ReadOutlined />,
            color: '#13c2c2',
            link: '/admin/subjects',
        },
        {
            title: 'Người dùng',
            value: stats.totalUsers,
            icon: <UserSwitchOutlined />,
            color: '#eb2f96',
            link: '/admin/users',
        },
        {
            title: 'Bài kiểm tra/Điểm',
            value: stats.totalScores,
            icon: <FileTextOutlined />,
            color: '#52c41a',
            link: '/admin/scores',
        },
        {
            title: 'Phân công',
            value: stats.totalAssignments,
            icon: <CalendarOutlined />,
            color: '#2f54eb',
            link: '/admin/teaching-assignments',
        },
        {
            title: 'Thông báo',
            value: stats.totalNotifications,
            icon: <BellOutlined />,
            color: '#fadb14',
            link: '#',
        },
        {
            title: 'Vai trò/Quyền',
            value: stats.totalRoles,
            icon: <SafetyOutlined />,
            color: '#fa541c',
            link: '#',
        },
    ];

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s' }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    {/* Sửa: Thay variant="borderless" bằng bordered={false} nếu bản Antd của bạn bị lỗi tương thích */}
                    <Card bordered={false} style={{ marginBottom: 16 }}>
                        <Title level={3}>Dashboard Quản trị</Title>
                        <Text type="secondary">
                            Tổng quan dữ liệu toàn hệ thống Student Management
                        </Text>
                    </Card>
                </Col>

                {statCards.map((c, i) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={i}>
                        <Card
                            bordered={false}
                            hoverable
                            onClick={() => c.link !== '#' && navigate(c.link)}
                            style={{
                                cursor: c.link !== '#' ? 'pointer' : 'default',
                            }}
                        >
                            <Statistic
                                title={c.title}
                                value={c.value}
                                valueStyle={{
                                    color: c.color,
                                    fontWeight: 'bold',
                                }}
                                prefix={c.icon}
                                suffix={
                                    <ArrowUpOutlined
                                        style={{ fontSize: 12, marginLeft: 8 }}
                                    />
                                }
                            />
                            <div style={{ marginTop: 8 }}>
                                <Tag color="green">+4% so với tháng trước</Tag>
                            </div>
                        </Card>
                    </Col>
                ))}

                <Col xs={24} lg={16}>
                    <Card
                        title="Hoạt động gần đây"
                        bordered={false}
                        extra={<a href="#">Xem tất cả</a>}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={stats.recentActivities}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                icon={<GlobalOutlined />}
                                                style={{
                                                    backgroundColor: '#f56a00',
                                                }}
                                            />
                                        }
                                        title={
                                            item.title || 'Hoạt động hệ thống'
                                        }
                                        description={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <span>
                                                    {item.desc ||
                                                        'Không có mô tả'}
                                                </span>
                                                <Text
                                                    type="secondary"
                                                    style={{ fontSize: 12 }}
                                                >
                                                    {item.time || 'Vừa xong'}
                                                </Text>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                            locale={{ emptyText: 'Chưa có hoạt động nào' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Tỷ lệ học lực (Mẫu)" bordered={false}>
                        <div
                            style={{
                                height: 260,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fafafa',
                                borderRadius: 8,
                            }}
                        >
                            <Text type="secondary" italic>
                                Pie Chart Placeholder
                            </Text>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <Row gutter={[8, 8]}>
                                <Col span={12}>
                                    <Tag color="blue">Giỏi: 24%</Tag>
                                </Col>
                                <Col span={12}>
                                    <Tag color="green">Khá: 45%</Tag>
                                </Col>
                                <Col span={12}>
                                    <Tag color="orange">Trung bình: 28%</Tag>
                                </Col>
                                <Col span={12}>
                                    <Tag color="red">Yếu: 3%</Tag>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;

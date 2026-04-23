import React, { useState } from 'react';
import {
    Layout,
    Menu,
    Button,
    Avatar,
    Dropdown,
    Space,
    Typography,
    Tag,
} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    BookOutlined,
    FormOutlined,
    SolutionOutlined,
    LogoutOutlined,
    SwapOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AntAdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    const getMenuItems = () => {
        const items = [
            {
                key: '/admin',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
                roles: ['ADMIN'],
            },
            {
                key: '/admin/student-dashboard',
                icon: <DashboardOutlined />,
                label: 'Tổng quan học tập',
                roles: ['STUDENT'],
            },
            {
                key: '/admin/users',
                icon: <UserOutlined />,
                label: 'Quản lý Người dùng',
                roles: ['ADMIN'],
            },
            {
                key: '/admin/students',
                icon: <TeamOutlined />,
                label: 'Sinh viên',
                roles: ['ADMIN'],
            },
            {
                key: '/admin/profile',
                icon: <UserOutlined />,
                label: 'Thông tin cá nhân',
                roles: ['STUDENT'],
            },
            {
                key: '/admin/teachers',
                icon: <SolutionOutlined />,
                label: 'Giáo viên',
                roles: ['ADMIN'],
            },
            {
                key: '/admin/classes',
                icon: <BookOutlined />,
                label: 'Lớp học & Môn học',
                roles: ['ADMIN'],
            },
            {
                key: '/admin/scores',
                icon: <SolutionOutlined />,
                label: 'Bảng điểm',
                roles: ['ADMIN'],
            },
            {
                key: '/admin/schedule',
                icon: <BookOutlined />,
                label: 'Thời khóa biểu',
                roles: ['STUDENT'],
            },
            {
                key: '/admin/teaching-assignments',
                icon: <SwapOutlined />,
                label: 'Phân công giảng dạy',
                roles: ['ADMIN'],
            },
            {
                key: '/admin/my-classes',
                icon: <BookOutlined />,
                label: 'Lớp học của tôi',
                roles: ['TEACHER'],
            },
            {
                key: '/admin/grade-entry',
                icon: <FormOutlined />,
                label: 'Nhập điểm',
                roles: ['TEACHER'],
            },
            {
                key: '/admin/my-grades',
                icon: <SolutionOutlined />,
                label: 'Kết quả học tập',
                roles: ['STUDENT'],
            },
        ];

        // Thêm kiểm tra user?.roles để tránh lỗi undefined khi load trang
        return items
            .filter((item) =>
                item.roles.some((role) =>
                    user?.roles?.some(
                        (userRole) =>
                            userRole.toUpperCase() === role.toUpperCase()
                    )
                )
            )
            .map(({ roles: _, ...rest }) => rest);
    };

    // SỬA LỖI TẠI ĐÂY: Dùng Optional Chaining (?.) để tránh đọc thuộc tính của undefined
    const primaryRole = user?.roles?.[0] || 'N/A';

    // Nếu user chưa có dữ liệu, có thể hiển thị loading nhẹ để tránh vỡ giao diện
    if (!user) return null;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="dark"
                width={260}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
                }}
            >
                <div
                    style={{
                        height: 64,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: collapsed ? 12 : 18,
                        transition: 'all 0.2s',
                    }}
                >
                    {collapsed ? 'SMS' : 'Student MS'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={({ key }) => navigate(key)}
                    items={getMenuItems()}
                />
            </Sider>
            <Layout
                style={{
                    marginLeft: collapsed ? 80 : 260,
                    transition: 'all 0.2s',
                }}
            >
                <Header
                    style={{
                        padding: '0 24px',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                    }}
                >
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />

                    <Space size={24}>
                        <Tag color="blue" style={{ margin: 0 }}>
                            {primaryRole}
                        </Tag>

                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'logout',
                                        icon: <LogoutOutlined />,
                                        label: 'Đăng xuất',
                                    },
                                ],
                                onClick: onLogout,
                            }}
                            placement="bottomRight"
                        >
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar
                                    icon={<UserOutlined />}
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        lineHeight: '1.2',
                                    }}
                                >
                                    <Text strong>{user?.fullName}</Text>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 12 }}
                                    >
                                        {primaryRole}
                                    </Text>
                                </div>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: '#f0f2f5',
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AntAdminLayout;

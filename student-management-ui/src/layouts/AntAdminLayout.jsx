import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Avatar, 
  Dropdown, 
  Space, 
  Typography, 
  Card,
  Tag
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
  GlobalOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AntAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    const items = [
      {
        key: '/admin',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        roles: ['ADMIN'],
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

    return items
      .filter(item => item.roles.includes(user.role))
      .map(({ roles, ...rest }) => rest);
  };

  const roleMenu = (
    <Menu
      onClick={({ key }) => switchRole(key)}
      items={[
        { key: 'ADMIN', label: 'Vai trò: Admin' },
        { key: 'TEACHER', label: 'Vai trò: Giáo viên' },
        { key: 'STUDENT', label: 'Vai trò: Học sinh' },
      ]}
    />
  );

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
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
        }}
      >
        <div style={{ 
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
          transition: 'all 0.2s'
        }}>
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
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Space size={24}>
            <Dropdown overlay={roleMenu} placement="bottomRight">
              <Button icon={<SwapOutlined />} type="dashed">
                Chuyển vai trò <Tag color="blue" style={{ marginLeft: 8 }}>{user.role}</Tag>
              </Button>
            </Dropdown>

            <Dropdown menu={{ items: [{ key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' }] }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <Text strong>{user.fullName}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{user.role}</Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#f0f2f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AntAdminLayout;

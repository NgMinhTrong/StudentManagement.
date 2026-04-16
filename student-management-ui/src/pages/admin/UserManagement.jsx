import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, message, Typography, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import api from '../../api/axios';

const { Text } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/Users');
      setUsers(res.data);
    } catch (err) {
      message.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { 
      title: 'Username', 
      dataIndex: 'username', 
      key: 'username',
      render: (text, row) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'Hoạt động' : 'Bị khóa'}</Tag>
    },
    { 
      title: 'Vai trò', 
      dataIndex: 'roles', 
      key: 'roles',
      render: (roles) => (
        <>
          {roles.map(r => <Tag key={r} color="blue">{r}</Tag>)}
        </>
      )
    },
  ];

  return (
    <Card title="Quản lý Tài khoản người dùng" bordered={false}>
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id" 
        loading={loading}
        bordered
      />
    </Card>
  );
};

export default UserManagement;

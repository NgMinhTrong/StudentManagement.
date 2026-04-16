import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Typography, Tag, message } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api/axios';

const { Title } = Typography;

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/Students');
      setStudents(res.data);
    } catch (err) {
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { title: 'MSSV', dataIndex: 'studentCode', key: 'studentCode' },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', render: text => <span style={{ fontWeight: 600 }}>{text}</span> },
    { title: 'Lớp', dataIndex: 'className', key: 'className' },
    { title: 'Ngày sinh', dataIndex: 'birthday', key: 'birthday', render: date => new Date(date).toLocaleDateString('vi-VN') },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (row) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => message.info('Tính năng xóa đang bảo trì')} />
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title={<Title level={4} style={{ margin: 0 }}>Quản lý Sinh viên</Title>}
      extra={<Button type="primary" icon={<UserAddOutlined />}>Thêm sinh viên</Button>}
      bordered={false}
    >
      <Table 
        columns={columns} 
        dataSource={students} 
        rowKey="id" 
        loading={loading}
        bordered
      />
    </Card>
  );
};

export default StudentManagement;

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  message, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker,
  Popconfirm,
  Tooltip
} from 'antd';
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import api from '../../api/axios';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  // Lấy dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentRes, classRes, userRes] = await Promise.all([
        api.get('/Students'),
        api.get('/Classes'),
        api.get('/Users')
      ]);
      setStudents(studentRes.data);
      setClasses(classRes.data);
      // Chỉ lấy những user có vai trò STUDENT
      const studentUsers = userRes.data.filter(u => u.roles && u.roles.includes('Student'));
      setUsers(studentUsers);
    } catch (err) {
      message.error('Lỗi khi tải dữ liệu từ hệ thống');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mở modal thêm mới
  const showAddModal = () => {
    setEditingStudent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal chỉnh sửa
  const showEditModal = (record) => {
    setEditingStudent(record);
    form.setFieldsValue({
      ...record,
      birthday: record.birthday ? dayjs(record.birthday) : null,
    });
    setIsModalVisible(true);
  };

  // Xử lý Xóa sinh viên
  const handleDelete = async (id) => {
    try {
      await api.delete(`/Students/${id}`);
      message.success('Đã xóa sinh viên thành công');
      fetchData();
    } catch (err) {
      message.error('Không thể xóa sinh viên này. Vui lòng kiểm tra lại.');
    }
  };

  // Xử lý Lưu (Thêm/Sửa)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        birthday: values.birthday.toISOString(),
      };

      if (editingStudent) {
        await api.put(`/Students/${editingStudent.id}`, payload);
        message.success('Cập nhật thông tin sinh viên thành công');
      } else {
        await api.post('/Students', payload);
        message.success('Thêm sinh viên mới thành công');
      }
      
      setIsModalVisible(false);
      fetchData();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        message.error(err.response.data.message);
      } else {
        message.error('Có lỗi xảy ra khi lưu dữ liệu');
      }
    }
  };

  const columns = [
    { 
      title: 'MSSV', 
      dataIndex: 'studentCode', 
      key: 'studentCode',
      width: 120,
      render: text => <Tag color="blue">{text}</Tag>
    },
    { 
      title: 'Họ tên', 
      dataIndex: 'fullName', 
      key: 'fullName', 
      render: text => <span style={{ fontWeight: 600 }}>{text}</span> 
    },
    { 
      title: 'Lớp', 
      dataIndex: 'className', 
      key: 'className',
      filters: classes.map(c => ({ text: c.className, value: c.className })),
      onFilter: (value, record) => record.className === value,
    },
    { 
      title: 'Ngày sinh', 
      dataIndex: 'birthday', 
      key: 'birthday', 
      render: date => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A' 
    },
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => showEditModal(record)} 
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa sinh viên?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Card 
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>Quản lý Sinh viên</Title>
            <Button icon={<ReloadOutlined />} onClick={fetchData} type="text" />
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<UserAddOutlined />} 
            onClick={showAddModal}
            size="large"
          >
            Thêm sinh viên
          </Button>
        }
        variant="borderless"
        style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)' }}
      >
        <Table 
          columns={columns} 
          dataSource={students} 
          rowKey="id" 
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} sinh viên`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Modal Thêm/Sửa Sinh viên */}
      <Modal
        title={editingStudent ? "Cập nhật thông tin sinh viên" : "Thêm sinh viên mới"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
        // Ngăn đóng modal khi click ra ngoài
        mask={{ closable: false }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="studentCode"
              label="Mã số sinh viên (MSSV)"
              rules={[{ required: true, message: 'Vui lòng nhập MSSV' }]}
            >
              <Input placeholder="Ví dụ: SV2024001" disabled={!!editingStudent} />
            </Form.Item>

            <Form.Item
              name="fullName"
              label="Họ và Tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder="Nhập tên đầy đủ" />
            </Form.Item>

            <Form.Item
              name="birthday"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
            </Form.Item>

            <Form.Item
              name="classId"
              label="Lớp học"
              rules={[{ required: true, message: 'Vui lòng chọn lớp' }]}
            >
              <Select placeholder="Chọn lớp">
                {classes.map(c => (
                  <Option key={c.id} value={c.id}>{c.className}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="userId"
              label="Tài khoản liên kết"
              rules={[{ required: true, message: 'Vui lòng chọn tài khoản' }]}
              extra="Sinh viên cần một tài khoản để đăng nhập hệ thống"
            >
              <Select 
                placeholder="Chọn người dùng" 
                showSearch
                optionFilterProp="children"
              >
                {users.map(u => (
                  <Option key={u.id} value={u.id}>{u.username} ({u.fullName})</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <Space direction="vertical" style={{ width: '100%' }}>
             <Typography.Link style={{ fontSize: 12 }}>+ Tạo nhanh tài khoản mới (Tính năng sắp ra mắt)</Typography.Link>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentManagement;

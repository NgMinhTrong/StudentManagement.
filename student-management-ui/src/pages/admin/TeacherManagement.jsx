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
  SolutionOutlined 
} from '@ant-design/icons';
import api from '../../api/axios';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form] = Form.useForm();

  // Lấy dữ liệu giáo viên và người dùng (để gán tài khoản)
  const fetchData = async () => {
    setLoading(true);
    try {
      const [teacherRes, userRes] = await Promise.all([
        api.get('/Teachers'),
        api.get('/Users')
      ]);
      setTeachers(teacherRes.data);
      setUsers(userRes.data);
    } catch (err) {
      message.error('Lỗi khi tải dữ liệu giáo viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mở modal thêm mới
  const showAddModal = () => {
    setEditingTeacher(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal chỉnh sửa
  const showEditModal = (record) => {
    setEditingTeacher(record);
    form.setFieldsValue({
      ...record,
      hireDate: record.hireDate ? dayjs(record.hireDate) : null,
    });
    setIsModalVisible(true);
  };

  // Xử lý Xóa giáo viên
  const handleDelete = async (id) => {
    try {
      await api.delete(`/Teachers/${id}`);
      message.success('Đã xóa giáo viên thành công');
      fetchData();
    } catch (err) {
      message.error('Lỗi khi xóa giáo viên. Có thể giáo viên này đang chủ nhiệm một lớp học.');
    }
  };

  // Xử lý Lưu (Thêm/Sửa)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        hireDate: values.hireDate.toISOString(),
      };

      if (editingTeacher) {
        await api.put(`/Teachers/${editingTeacher.id}`, payload);
        message.success('Cập nhật thông tin giáo viên thành công');
      } else {
        await api.post('/Teachers', payload);
        message.success('Thêm giáo viên mới thành công');
      }
      
      setIsModalVisible(false);
      fetchData();
    } catch (err) {
      message.error('Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  const columns = [
    { 
      title: 'Mã GV', 
      dataIndex: 'teacherCode', 
      key: 'teacherCode',
      width: 120,
      render: text => <Tag color="cyan">{text}</Tag>
    },
    { 
      title: 'Họ và Tên', 
      dataIndex: 'fullName', 
      key: 'fullName', 
      render: text => <span style={{ fontWeight: 600 }}>{text}</span> 
    },
    { 
      title: 'Chuyên môn', 
      dataIndex: 'specialization', 
      key: 'specialization',
      render: text => <Tag color="geekblue">{text || 'Chưa cập nhật'}</Tag>
    },
    { 
      title: 'Ngày vào làm', 
      dataIndex: 'hireDate', 
      key: 'hireDate', 
      render: date => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A' 
    },
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email',
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
              title="Xác nhận xóa giáo viên?"
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
            <Title level={4} style={{ margin: 0 }}>Quản lý Giáo viên</Title>
            <Button icon={<ReloadOutlined />} onClick={fetchData} type="text" />
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<SolutionOutlined />} 
            onClick={showAddModal}
            size="large"
          >
            Thêm giáo viên
          </Button>
        }
        variant="borderless"
        style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)' }}
      >
        <Table 
          columns={columns} 
          dataSource={teachers} 
          rowKey="id" 
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng cộng ${total} giáo viên`,
          }}
        />
      </Card>

      {/* Modal Thêm/Sửa Giáo viên */}
      <Modal
        title={editingTeacher ? "Cập nhật thông tin giáo viên" : "Thêm giáo viên mới"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
        mask={{ closable: false }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="teacherCode"
              label="Mã giáo viên"
              rules={[{ required: true, message: 'Vui lòng nhập mã giáo viên' }]}
            >
              <Input placeholder="Ví dụ: GV001" disabled={!!editingTeacher} />
            </Form.Item>

            <Form.Item
              name="specialization"
              label="Chuyên môn"
              rules={[{ required: true, message: 'Vui lòng nhập chuyên môn' }]}
            >
              <Input placeholder="Ví dụ: Toán học, Tin học" />
            </Form.Item>

            <Form.Item
              name="hireDate"
              label="Ngày vào làm"
              rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              name="userId"
              label="Tài khoản liên kết"
              rules={[{ required: true, message: 'Vui lòng chọn tài khoản' }]}
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
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherManagement;

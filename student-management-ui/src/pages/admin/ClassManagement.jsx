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
  InputNumber,
  Popconfirm,
  Tooltip
} from 'antd';
import { 
  BookOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import api from '../../api/axios';

const { Title } = Typography;
const { Option } = Select;

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form] = Form.useForm();

  // Lấy dữ liệu lớp học và giáo viên
  const fetchData = async () => {
    setLoading(true);
    try {
      const [classRes, teacherRes] = await Promise.all([
        api.get('/Classes'),
        api.get('/Teachers')
      ]);
      setClasses(classRes.data);
      setTeachers(teacherRes.data);
    } catch (err) {
      message.error('Lỗi khi tải dữ liệu lớp học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mở modal thêm mới
  const showAddModal = () => {
    setEditingClass(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal chỉnh sửa
  const showEditModal = (record) => {
    setEditingClass(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Xử lý Xóa lớp học
  const handleDelete = async (id) => {
    try {
      await api.delete(`/Classes/${id}`);
      message.success('Đã xóa lớp học thành công');
      fetchData();
    } catch (err) {
      message.error('Không thể xóa lớp học này. Có thể lớp đang có sinh viên hoặc phân công dạy.');
    }
  };

  // Xử lý Lưu (Thêm/Sửa)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingClass) {
        await api.put(`/Classes/${editingClass.id}`, values);
        message.success('Cập nhật thông tin lớp học thành công');
      } else {
        await api.post('/Classes', values);
        message.success('Thêm lớp học mới thành công');
      }
      
      setIsModalVisible(false);
      fetchData();
    } catch (err) {
      message.error('Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  const columns = [
    { 
      title: 'Tên lớp', 
      dataIndex: 'className', 
      key: 'className',
      render: text => <span style={{ fontWeight: 600 }}>{text}</span> 
    },
    { 
      title: 'Khối', 
      dataIndex: 'grade', 
      key: 'grade',
      render: grade => <Tag color="blue">Khối {grade}</Tag>
    },
    { 
      title: 'Năm học', 
      dataIndex: 'academicYear', 
      key: 'academicYear',
    },
    { 
      title: 'Phòng học', 
      dataIndex: 'roomNumber', 
      key: 'roomNumber',
      render: text => text || 'N/A'
    },
    { 
      title: 'GV Chủ nhiệm', 
      dataIndex: 'homeroomTeacherName', 
      key: 'homeroomTeacherName',
      render: text => text || <Text type="secondary">Chưa phân công</Text>
    },
    { 
      title: 'Sĩ số', 
      dataIndex: 'studentCount', 
      key: 'studentCount',
      render: count => <Tag color="green">{count} HS</Tag>
    },
    {
      title: 'Thao tác',
      key: 'action',
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
              title="Xác nhận xóa lớp học?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
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
            <Title level={4} style={{ margin: 0 }}>Quản lý Lớp học</Title>
            <Button icon={<ReloadOutlined />} onClick={fetchData} type="text" />
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
            size="large"
          >
            Thêm lớp học
          </Button>
        }
        variant="borderless"
      >
        <Table 
          columns={columns} 
          dataSource={classes} 
          rowKey="id" 
          loading={loading}
          bordered
        />
      </Card>

      {/* Modal Thêm/Sửa Lớp học */}
      <Modal
        title={editingClass ? "Cập nhật thông tin lớp học" : "Thêm lớp học mới"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={500}
        mask={{ closable: false }} // Ngăn đóng modal khi click ra ngoài
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="className"
            label="Tên lớp học"
            rules={[{ required: true, message: 'Vui lòng nhập tên lớp' }]}
          >
            <Input placeholder="Ví dụ: 10A1" />
          </Form.Item>

          <Form.Item
            name="grade"
            label="Khối lớp"
            rules={[{ required: true, message: 'Vui lòng chọn khối' }]}
          >
            <Select placeholder="Chọn khối">
              <Option value={10}>Khối 10</Option>
              <Option value={11}>Khối 11</Option>
              <Option value={12}>Khối 12</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="academicYear"
            label="Năm học"
            rules={[{ required: true, message: 'Vui lòng nhập năm học' }]}
          >
            <Input placeholder="Ví dụ: 2023-2024" />
          </Form.Item>

          <Form.Item
            name="roomNumber"
            label="Phòng học"
          >
            <Input placeholder="Ví dụ: Phòng 101" />
          </Form.Item>

          <Form.Item
            name="homeroomTeacherId"
            label="Giáo viên chủ nhiệm"
          >
            <Select 
              placeholder="Chọn giáo viên" 
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {teachers.map(t => (
                <Option key={t.id} value={t.id}>{t.fullName} ({t.teacherCode})</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassManagement;

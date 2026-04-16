import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Select, 
  message, 
  Popconfirm,
  Card,
  Typography
} from 'antd';
import { PlusOutlined, DeleteOutlined, SwapOutlined } from '@ant-design/icons';
import api from '../../api/axios';

const { Title, Text } = Typography;

const TeachingAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignRes, teacherRes, classRes, subjectRes] = await Promise.all([
        api.get('/TeachingAssignments'),
        api.get('/Teachers'),
        api.get('/Classes'),
        api.get('/Subjects')
      ]);
      setAssignments(assignRes.data);
      setTeachers(teacherRes.data);
      setClasses(classRes.data);
      setSubjects(subjectRes.data);
    } catch (err) {
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (values) => {
    try {
      await api.post('/TeachingAssignments', {
        ...values,
        semester: values.semester || "1",
        schoolYear: values.schoolYear || "2024-2025"
      });
      message.success('Phân công thành công!');
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error('Lỗi khi phân công!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/TeachingAssignments/${id}`);
      message.success('Đã xóa phân công');
      fetchData();
    } catch (err) {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    { title: 'Giáo viên', dataIndex: 'teacherName', key: 'teacherName' },
    { title: 'Lớp học', dataIndex: 'className', key: 'className' },
    { title: 'Môn học', dataIndex: 'subjectName', key: 'subjectName' },
    { title: 'Học kỳ', dataIndex: 'semester', key: 'semester' },
    { title: 'Năm học', dataIndex: 'schoolYear', key: 'schoolYear' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (row) => (
        <Popconfirm title="Bạn có chắc muốn xóa phân công này?" onConfirm={() => handleDelete(row.id)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <Card 
      title={<Space><SwapOutlined /> Quản lý Phân công giảng dạy</Space>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Thêm phân công</Button>}
    >
      <Table 
        columns={columns} 
        dataSource={assignments} 
        rowKey="id" 
        loading={loading} 
        bordered
      />

      <Modal
        title="Thêm Phân công mới"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="teacherId" label="Chọn Giáo viên" rules={[{ required: true }]}>
            <Select placeholder="Chọn giáo viên">
              {teachers.map(t => <Select.Option key={t.id} value={t.id}>{t.fullName}</Select.Option>)}
            </Select>
          </Form.Item>
          
          <Form.Item name="classId" label="Chọn Lớp học" rules={[{ required: true }]}>
            <Select placeholder="Chọn lớp">
              {classes.map(c => <Select.Option key={c.id} value={c.id}>{c.className}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="subjectId" label="Chọn Môn học" rules={[{ required: true }]}>
            <Select placeholder="Chọn môn học">
              {subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.subjectName}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="schoolYear" label="Năm học" initialValue="2024-2025">
            <Select>
              <Select.Option value="2024-2025">2024-2025</Select.Option>
              <Select.Option value="2025-2026">2025-2026</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="semester" label="Học kỳ" initialValue="1">
            <Select>
              <Select.Option value="1">Học kỳ 1</Select.Option>
              <Select.Option value="2">Học kỳ 2</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TeachingAssignments;

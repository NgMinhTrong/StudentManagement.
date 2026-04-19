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
  InputNumber, 
  Select, 
  Row, 
  Col,
  Tooltip,
  Input
} from 'antd';
import { 
  FileTextOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  FilterOutlined 
} from '@ant-design/icons';
import api from '../../api/axios';

const { Title, Text } = Typography;
const { Option } = Select;

const ScoreManagement = () => {
  const [scores, setScores] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho bộ lọc
  const [filter, setFilter] = useState({ classId: null, subjectId: null, semester: null });

  // State cho Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [form] = Form.useForm();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = async () => {
    try {
      const [classRes, subjectRes, studentRes] = await Promise.all([
        api.get('/Classes'),
        api.get('/Subjects'),
        api.get('/Students')
      ]);
      setClasses(classRes.data);
      setSubjects(subjectRes.data);
      setStudents(studentRes.data);
    } catch (err) {
      message.error('Lỗi khi tải dữ liệu cấu hình');
    }
  };

  // Lấy danh sách điểm (có lọc)
  const fetchScores = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.classId) params.classId = filter.classId;
      if (filter.subjectId) params.subjectId = filter.subjectId;
      if (filter.semester) params.semester = filter.semester;

      const response = await api.get('/Scores/filter', { params });
      setScores(response.data);
    } catch (error) {
      message.error('Lỗi khi lấy danh sách điểm số');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    fetchScores();
  }, []);

  // Gọi lại API khi filter thay đổi
  useEffect(() => {
    fetchScores();
  }, [filter]);

  // Mở modal thêm/sửa
  const showModal = (record = null) => {
    setEditingScore(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Xử lý Lưu điểm
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingScore) {
        await api.put(`/Scores/${editingScore.id}`, values);
        message.success('Cập nhật điểm thành công');
      } else {
        await api.post('/Scores', values);
        message.success('Đã nhập điểm mới thành công');
      }
      setIsModalVisible(false);
      fetchScores();
    } catch (err) {
      message.error('Lỗi khi lưu dữ liệu điểm');
    }
  };

  const columns = [
    { 
      title: 'Mã SV', 
      dataIndex: 'studentCode', 
      key: 'studentCode',
      render: text => <Tag color="blue">{text}</Tag>
    },
    { title: 'Sinh viên', dataIndex: 'studentName', key: 'studentName', weight: 150 },
    { title: 'Môn học', dataIndex: 'subjectName', key: 'subjectName' },
    { title: 'Học kỳ', dataIndex: 'semester', key: 'semester' },
    { 
        title: 'Điểm 15p', 
        dataIndex: 'score15Min', 
        key: 'score15Min',
        render: val => val !== null ? val : '-'
    },
    { 
        title: 'Điểm 45p', 
        dataIndex: 'score45Min', 
        key: 'score45Min',
        render: val => val !== null ? val : '-'
    },
    { 
        title: 'Cuối kỳ', 
        dataIndex: 'scoreFinal', 
        key: 'scoreFinal',
        render: val => val !== null ? val : '-'
    },
    { 
      title: 'ĐTB', 
      dataIndex: 'averageScore', 
      key: 'averageScore',
      render: (val) => (
        <Text strong style={{ color: val >= 5 ? '#52c41a' : '#f5222d' }}>
          {val?.toFixed(2) || 'N/A'}
        </Text>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Tooltip title="Chỉnh sửa điểm">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: '#1890ff' }} />} 
            onClick={() => showModal(record)} 
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Card variant="borderless" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="bottom">
          <Col span={6}>
            <Text strong>Lọc theo Lớp:</Text>
            <Select 
              style={{ width: '100%', marginTop: 8 }} 
              placeholder="Tất cả lớp" 
              allowClear
              onChange={val => setFilter({...filter, classId: val})}
            >
              {classes.map(c => <Option key={c.id} value={c.id}>{c.className}</Option>)}
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>Lọc theo Môn học:</Text>
            <Select 
              style={{ width: '100%', marginTop: 8 }} 
              placeholder="Tất cả môn" 
              allowClear
              onChange={val => setFilter({...filter, subjectId: val})}
            >
              {subjects.map(s => <Option key={s.id} value={s.id}>{s.subjectName}</Option>)}
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>Lọc học kỳ:</Text>
            <Select 
              style={{ width: '100%', marginTop: 8 }} 
              placeholder="Chọn học kỳ" 
              allowClear
              onChange={val => setFilter({...filter, semester: val})}
            >
              <Option value="HK1">Học kỳ 1</Option>
              <Option value="HK2">Học kỳ 2</Option>
            </Select>
          </Col>
          <Col span={6}>
             <Button icon={<ReloadOutlined />} onClick={fetchScores} block>Làm mới</Button>
          </Col>
        </Row>
      </Card>

      <Card 
        title={
          <Space>
            <FileTextOutlined />
            <Title level={4} style={{ margin: 0 }}>Bảng điểm tổng hợp</Title>
          </Space>
        }
        extra={
          <Button type="primary" onClick={() => showModal()} size="large">
            Nhập điểm mới
          </Button>
        }
        variant="borderless"
      >
        <Table 
          columns={columns} 
          dataSource={scores} 
          rowKey="id" 
          loading={loading}
          bordered
          pagination={{ pageSize: 12 }}
        />
      </Card>

      {/* Modal Nhập/Sửa Điểm */}
      <Modal
        title={editingScore ? "Cập nhật điểm số" : "Nhập điểm mới"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu điểm"
        cancelText="Hủy"
        width={500}
        // Ngăn đóng modal khi click vào vùng mask
        mask={{ closable: false }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="studentId"
            label="Sinh viên"
            rules={[{ required: true, message: 'Chọn sinh viên' }]}
          >
            <Select 
                placeholder="Tìm sinh viên..." 
                showSearch
                optionFilterProp="children"
                disabled={!!editingScore}
            >
              {students.map(s => <Option key={s.id} value={s.id}>{s.studentCode} - {s.fullName}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true, message: 'Chọn môn học' }]}
          >
            <Select placeholder="Chọn môn" disabled={!!editingScore}>
              {subjects.map(s => <Option key={s.id} value={s.id}>{s.subjectName}</Option>)}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="semester"
                label="Học kỳ"
                rules={[{ required: true, message: 'Chọn học kỳ' }]}
              >
                <Select placeholder="HK1/HK2" disabled={!!editingScore}>
                  <Option value="HK1">Học kỳ 1</Option>
                  <Option value="HK2">Học kỳ 2</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="score15Min" label="Điểm 15 phút">
                    <InputNumber min={0} max={10} style={{ width: '100%' }} step={0.25} />
                </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
                <Form.Item name="score45Min" label="Điểm 1 tiết (45p)">
                    <InputNumber min={0} max={10} style={{ width: '100%' }} step={0.25} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="scoreFinal" label="Điểm thi cuối kỳ">
                    <InputNumber min={0} max={10} style={{ width: '100%' }} step={0.25} />
                </Form.Item>
            </Col>
          </Row>

          <Form.Item name="teacherRemarks" label="Nhận xét của giáo viên">
            <Input.TextArea rows={3} placeholder="Ghi chú về học lực, thái độ..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScoreManagement;

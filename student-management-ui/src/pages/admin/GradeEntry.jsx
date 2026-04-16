import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Select, 
  InputNumber, 
  Button, 
  Space, 
  Typography, 
  message, 
  Row, 
  Col, 
  Tag 
} from 'antd';
import { SaveOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const GradeEntry = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [semester, setSemester] = useState('1');

  useEffect(() => {
    // Load Teacher's assigned classes and subjects
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          api.get('/Classes'),
          api.get('/Subjects')
        ]);
        setClasses(classesRes.data);
        setSubjects(subjectsRes.data);
      } catch (err) {
        message.error('Không thể tải danh sách lớp/môn học');
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!selectedClass || !selectedSubject) {
      message.warning('Vui lòng chọn đầy đủ Lớp và Môn học');
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.get(`/Scores/filter?classId=${selectedClass}&subjectId=${selectedSubject}&semester=${semester}`);
      setScores(res.data);
    } catch (err) {
      message.error('Lỗi khi tải bảng điểm');
    } finally {
      setLoading(false);
    }
  };

  const updateScoreValue = (id, field, value) => {
    setScores(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async (record) => {
    try {
      await api.put(`/Scores/${record.id}`, {
        studentId: record.studentId,
        subjectId: record.subjectId,
        semester: record.semester,
        score15Min: record.score15Min,
        score45Min: record.score45Min,
        scoreFinal: record.scoreFinal
      });
      message.success(`Đã lưu điểm cho học sinh ${record.studentName}`);
      handleSearch(); // Refresh to update AverageScore
    } catch (err) {
      message.error('Lưu thất bại!');
    }
  };

  const columns = [
    { title: 'MSSV', dataIndex: 'studentCode', key: 'studentCode', width: 120 },
    { title: 'Họ và tên', dataIndex: 'studentName', key: 'studentName', width: 200 },
    { 
      title: 'Điểm 15P', 
      key: 'score15Min',
      render: (row) => (
        <InputNumber 
          min={0} max={10} step={0.1} 
          value={row.score15Min} 
          onChange={(v) => updateScoreValue(row.id, 'score15Min', v)} 
        />
      )
    },
    { 
      title: 'Điểm 45P', 
      key: 'score45Min',
      render: (row) => (
        <InputNumber 
          min={0} max={10} step={0.1} 
          value={row.score45Min} 
          onChange={(v) => updateScoreValue(row.id, 'score45Min', v)} 
        />
      )
    },
    { 
      title: 'Điểm Cuối kỳ', 
      key: 'scoreFinal',
      render: (row) => (
        <InputNumber 
          min={0} max={10} step={0.1} 
          value={row.scoreFinal} 
          onChange={(v) => updateScoreValue(row.id, 'scoreFinal', v)} 
        />
      )
    },
    { 
      title: 'ĐTB', 
      dataIndex: 'averageScore', 
      key: 'averageScore',
      render: (val) => <Tag color={val >= 5 ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{val?.toFixed(2) || '0.00'}</Tag>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (row) => (
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          onClick={() => handleSave(row)}
          size="small"
        >
          Lưu
        </Button>
      )
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title={<Space><FormOutlined /> Nhập điểm học sinh</Space>} bordered={false}>
        <Row gutter={16} align="bottom">
          <Col span={6}>
            <Text strong>Chọn Lớp:</Text>
            <Select 
              style={{ width: '100%', marginTop: 8 }} 
              placeholder="-- Chọn Lớp --"
              onChange={setSelectedClass}
            >
              {classes.map(c => <Option key={c.id} value={c.id}>{c.className}</Option>)}
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>Chọn Môn học:</Text>
            <Select 
              style={{ width: '100%', marginTop: 8 }} 
              placeholder="-- Chọn Môn --"
              onChange={setSelectedSubject}
            >
              {subjects.map(s => <Option key={s.id} value={s.id}>{s.subjectName}</Option>)}
            </Select>
          </Col>
          <Col span={4}>
            <Text strong>Học kỳ:</Text>
            <Select 
              style={{ width: '100%', marginTop: 8 }} 
              value={semester}
              onChange={setSemester}
            >
              <Option value="1">Học kỳ 1</Option>
              <Option value="2">Học kỳ 2</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
                Lọc danh sách
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => { setScores([]); setSelectedClass(null); }}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Table 
        columns={columns} 
        dataSource={scores} 
        rowKey="id" 
        loading={loading}
        bordered
        pagination={false}
        footer={() => <div style={{ textAlign: 'right' }}><Text type="secondary">Tổng số học sinh: {scores.length}</Text></div>}
      />
    </Space>
  );
};

export default GradeEntry;

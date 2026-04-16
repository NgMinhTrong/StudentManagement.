import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import api from '../../api/axios';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { header: 'Mã GV', accessor: 'teacherCode' },
    { 
      header: 'Họ và Tên', 
      accessor: 'fullName',
      render: (row) => (
        <span className="font-semibold text-white">{row.fullName}</span>
      )
    },
    { header: 'Chuyên môn', accessor: 'specialization' },
    { 
      header: 'Ngày vào làm', 
      accessor: 'hireDate',
      render: (row) => new Date(row.hireDate).toLocaleDateString('vi-VN')
    },
    { header: 'Email', accessor: 'email' },
  ];

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giáo viên:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DataTable
        title="Quản lý Giáo viên"
        columns={columns}
        data={teachers}
        isLoading={loading}
        onEdit={(row) => console.log('Edit', row)}
        onDelete={(row) => console.log('Delete', row)}
        onAdd={() => console.log('Add')}
      />
    </div>
  );
};

export default TeacherManagement;

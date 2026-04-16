import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import api from '../../api/axios';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { header: 'Tên lớp', accessor: 'className' },
    { header: 'Khối', accessor: 'grade' },
    { header: 'Năm học', accessor: 'academicYear' },
    { header: 'Phòng học', accessor: 'roomNumber' },
    { header: 'GV Chủ nhiệm', accessor: 'homeroomTeacherName' },
    { 
      header: 'Sĩ số', 
      accessor: 'studentCount',
      render: (row) => (
        <span className="bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full text-xs font-bold border border-primary-500/20">
          {row.studentCount} HS
        </span>
      )
    },
  ];

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lớp học:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DataTable
        title="Quản lý Lớp học"
        columns={columns}
        data={classes}
        isLoading={loading}
        onEdit={(row) => console.log('Edit', row)}
        onDelete={(row) => console.log('Delete', row)}
        onAdd={() => console.log('Add')}
      />
    </div>
  );
};

export default ClassManagement;

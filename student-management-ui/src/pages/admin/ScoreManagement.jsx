import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import api from '../../api/axios';

const ScoreManagement = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { header: 'Mã SV', accessor: 'studentCode' },
    { header: 'Sinh viên', accessor: 'studentName' },
    { header: 'Môn học', accessor: 'subjectName' },
    { header: 'Học kỳ', accessor: 'semester' },
    { header: 'Điểm 15p', accessor: 'score15Min' },
    { header: 'Điểm 45p', accessor: 'score45Min' },
    { header: 'Cuối kỳ', accessor: 'scoreFinal' },
    { 
      header: 'ĐTB', 
      accessor: 'averageScore',
      render: (row) => (
        <span className={`font-bold ${
          row.averageScore >= 5 ? 'text-emerald-500' : 'text-rose-500'
        }`}>
          {row.averageScore?.toFixed(2) || 'N/A'}
        </span>
      )
    },
  ];

  const fetchScores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Scores');
      setScores(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách điểm số:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DataTable
        title="Quản lý Điểm số"
        columns={columns}
        data={scores}
        isLoading={loading}
        onEdit={(row) => console.log('Edit', row)}
        onDelete={(row) => console.log('Delete', row)}
        onAdd={() => console.log('Add')}
      />
    </div>
  );
};

export default ScoreManagement;

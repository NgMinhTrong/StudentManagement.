import React from 'react';
import { Edit2, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ 
  title, 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onAdd, 
  isLoading 
}) => {
  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý và cập nhật danh sách {title.toLowerCase()}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500 w-64 transition-all"
            />
          </div>
          <button 
            onClick={onAdd}
            className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary-900/20 active:scale-95"
          >
            <Plus size={18} />
            Thêm mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/30 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4">{col.header}</th>
              ))}
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, idx) => (
                    <td key={idx} className="px-6 py-4">
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-800 rounded w-1/4 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20 transition-colors group">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-6 py-4 text-sm text-slate-300">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(row)}
                        className="p-2 text-slate-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(row)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500 italic">
                  Không tìm thấy dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-500 bg-slate-800/10">
        <p>Hiển thị {data.length} bản ghi</p>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-800 rounded-lg disabled:opacity-30" disabled>
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 py-1 bg-primary-600/10 text-primary-400 rounded-lg font-bold">1</span>
          <button className="p-2 hover:bg-slate-800 rounded-lg disabled:opacity-30" disabled>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

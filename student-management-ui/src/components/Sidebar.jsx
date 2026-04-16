import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck, 
  School,
  Settings,
  LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Users size={20} />, label: 'Quản lý Người dùng', path: '/admin/users' },
    { icon: <GraduationCap size={20} />, label: 'Quản lý Sinh viên', path: '/admin/students' },
    { icon: <School size={20} />, label: 'Quản lý Giáo viên', path: '/admin/teachers' },
    { icon: <BookOpen size={20} />, label: 'Quản lý Lớp học', path: '/admin/classes' },
    { icon: <ClipboardCheck size={20} />, label: 'Quản lý Điểm số', path: '/admin/scores' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen text-slate-300 flex flex-col fixed left-0 top-0 shadow-xl border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-primary-500 p-2 rounded-lg">
          <GraduationCap className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">StudentMS</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40' 
                : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-slate-800 hover:text-white transition-all text-slate-400">
          <LogOut size={20} />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

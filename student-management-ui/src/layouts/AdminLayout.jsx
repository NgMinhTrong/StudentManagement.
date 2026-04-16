import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 w-96 focus-within:border-primary-500 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhanh..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder:text-slate-500"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-800 pl-6 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">Admin User</p>
                <p className="text-xs text-slate-500">Quản trị viên</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center border-2 border-slate-700 group-hover:border-primary-500 transition-all shadow-lg">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const SiteLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <GraduationCap className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">StudentPortal</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/site" end className={({isActive}) => `text-sm font-medium ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-500'}`}>Trang chủ</NavLink>
              <NavLink to="/site/grades" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-500'}`}>Tra cứu điểm</NavLink>
              <NavLink to="/site/about" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-500'}`}>Về chúng tôi</NavLink>
            </div>

            <div className="flex items-center gap-4">
              <NavLink to="/admin" className="text-sm font-semibold text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg transition-all">Đăng nhập Admin</NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Placeholder */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2026 Student Management System. Built with React & ASP.NET.</p>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;

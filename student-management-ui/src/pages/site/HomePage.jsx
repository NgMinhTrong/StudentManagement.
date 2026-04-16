import React from 'react';
import { ArrowRight, BookOpen, Clock, Award } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Hệ thống Quản lý Giáo dục Hiện đại
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Giải pháp toàn diện cho việc quản lý sinh viên, giáo viên và điểm số. Đơn giản, hiệu quả và mạnh mẽ.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="#" className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all">
                Bắt đầu ngay
              </a>
              <a href="#" className="text-sm font-semibold leading-6 text-slate-900 flex items-center gap-1 group">
                Tìm hiểu thêm <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Vượt trội</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Mọi thứ bạn cần để quản lý trường học
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {[
                { name: 'Quản lý sinh viên', icon: <BookOpen />, desc: 'Lưu trữ thông tin học tập và cá nhân của hàng ngàn sinh viên.' },
                { name: 'Tra cứu điểm nhanh', icon: <Clock />, desc: 'Hệ thống tra cứu điểm tức thời với độ chính xác tuyệt đối.' },
                { name: 'Phân công giảng dạy', icon: <Award />, desc: 'Tối ưu hóa lịch dạy và chuyên môn cho đội ngũ giáo viên.' },
                { name: 'Báo cáo thông minh', icon: <ArrowRight />, desc: 'Tự động tính toán điểm trung bình và xếp loại học vụ.' }
              ].map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-slate-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      {React.cloneElement(feature.icon, { className: 'text-white', size: 20 })}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-slate-600">{feature.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

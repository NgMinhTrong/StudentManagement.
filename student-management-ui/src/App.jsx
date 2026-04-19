import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AntAdminLayout from './layouts/AntAdminLayout';
import Dashboard from './pages/admin/Dashboard';
import StudentManagement from './pages/admin/StudentManagement';
import TeacherManagement from './pages/admin/TeacherManagement';
import ClassManagement from './pages/admin/ClassManagement';
import UserManagement from './pages/admin/UserManagement';
import GradeEntry from './pages/admin/GradeEntry';
import MyGrades from './pages/admin/MyGrades';
import TeachingAssignments from './pages/admin/TeachingAssignments';
import StudentDashboard from './pages/admin/StudentDashboard';
import StudentProfile from './pages/admin/StudentProfile';
import WeeklySchedule from './pages/admin/WeeklySchedule';
import ScoreManagement from './pages/admin/ScoreManagement';
import { AuthProvider } from './api/AuthContext';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/" replace />} />

          {/* Main Layout with RBAC */}
          <Route path="/admin" element={<AntAdminLayout />}>
            {/* Dashboard redirect logic inside AntAdminLayout or here */}
            <Route index element={<Dashboard />} />
            <Route path="student-dashboard" element={<StudentDashboard />} />

            {/* Admin Only */}
            <Route path="users" element={<UserManagement />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="teachers" element={<TeacherManagement />} />
            <Route path="classes" element={<ClassManagement />} />
            <Route path="scores" element={<ScoreManagement />} />
            <Route path="teaching-assignments" element={<TeachingAssignments />} />

            {/* Teacher Only */}
            <Route path="grade-entry" element={<GradeEntry />} />
            <Route path="my-classes" element={<div>Danh sách lớp của tôi (Placeholder)</div>} />

            {/* Student Only */}
            <Route path="my-grades" element={<MyGrades />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="schedule" element={<WeeklySchedule />} />
          </Route>

          {/* Public Site Placeholder */}
          <Route path="/site" element={<div style={{ padding: 50 }}>Public Site Placeholder</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

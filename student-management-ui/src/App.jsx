import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Login from './pages/site/Login';
import { AuthProvider, useAuth } from './api/AuthContext';
import 'antd/dist/reset.css';
import './index.css';

// Component bảo vệ Route
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Hoặc loading spinner

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.some(role => 
    user.roles.some(userRole => userRole.toUpperCase() === role.toUpperCase())
  )) {
    // Nếu có role yêu cầu mà user không có, về trang chủ admin
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AntAdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="student-dashboard" element={<StudentDashboard />} />

            {/* Admin Only */}
            <Route path="users" element={<PrivateRoute roles={['ADMIN']}><UserManagement /></PrivateRoute>} />
            <Route path="students" element={<PrivateRoute roles={['ADMIN']}><StudentManagement /></PrivateRoute>} />
            <Route path="teachers" element={<PrivateRoute roles={['ADMIN']}><TeacherManagement /></PrivateRoute>} />
            <Route path="classes" element={<PrivateRoute roles={['ADMIN']}><ClassManagement /></PrivateRoute>} />
            <Route path="scores" element={<PrivateRoute roles={['ADMIN']}><ScoreManagement /></PrivateRoute>} />
            <Route path="teaching-assignments" element={<PrivateRoute roles={['ADMIN']}><TeachingAssignments /></PrivateRoute>} />

            {/* Teacher Only */}
            <Route path="grade-entry" element={<PrivateRoute roles={['TEACHER']}><GradeEntry /></PrivateRoute>} />
            <Route path="my-classes" element={<div>Danh sách lớp của tôi (Placeholder)</div>} />

            {/* Student Only */}
            <Route path="my-grades" element={<PrivateRoute roles={['STUDENT']}><MyGrades /></PrivateRoute>} />
            <Route path="profile" element={<PrivateRoute roles={['STUDENT']}><StudentProfile /></PrivateRoute>} />
            <Route path="schedule" element={<PrivateRoute roles={['STUDENT']}><WeeklySchedule /></PrivateRoute>} />
          </Route>

          <Route path="/site" element={<div style={{ padding: 50 }}>Public Site Placeholder</div>} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

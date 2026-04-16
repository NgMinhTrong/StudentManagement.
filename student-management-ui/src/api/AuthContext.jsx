import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Roles: 'ADMIN', 'TEACHER', 'STUDENT'
  const [user, setUser] = useState({
    username: 'admin',
    fullName: 'Quản trị viên',
    role: 'ADMIN',
    id: 1, // Dùng để filter data cho Teacher/Student
  });

  const switchRole = (role) => {
    const roles = {
      ADMIN: { username: 'admin', fullName: 'Quản trị viên', role: 'ADMIN', id: 1 },
      TEACHER: { username: 'gv_tu', fullName: 'Lê Văn Tú', role: 'TEACHER', id: 2 },
      STUDENT: { username: 'hs_an', fullName: 'Trần Văn An', role: 'STUDENT', id: 4 },
    };
    setUser(roles[role]);
  };

  return (
    <AuthContext.Provider value={{ user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

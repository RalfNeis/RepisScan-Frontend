import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'admin' | 'employee';

interface User {
  name: string;
  role: Role;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: Role, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: Role, email: string) => {
    setUser({
      role,
      email,
      name: role === 'admin' ? 'Dr. Santos' : 'Nurse Jenkins', // Mock names based on role
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

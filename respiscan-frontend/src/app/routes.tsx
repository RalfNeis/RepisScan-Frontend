import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { PatientRecords } from './pages/PatientRecords';
import { Diagnosis } from './pages/Diagnosis';
import { Reports } from './pages/Reports';
import { RegisterPatient } from './pages/RegisterPatient';
import { AccountSettings } from './pages/AccountSettings';
import { useAuth } from './context/AuthContext';

// ─── Route Guards ────────────────────────────────────────────────────────────

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: 'patients', Component: PatientRecords },
      { path: 'patients/new', Component: RegisterPatient },
      { path: 'diagnosis', Component: Diagnosis },
      { path: 'diagnosis/:patientId', Component: Diagnosis },
      { path: 'reports', Component: Reports },
      {
        path: 'employees',
        element: (
          <RequireAdmin>
            <EmployeeManagement />
          </RequireAdmin>
        ),
      },
      { path: 'settings', Component: AccountSettings },
    ],
  },
  {
    path: '*',
    Component: () => <Navigate to="/" replace />,
  },
]);


import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Overview } from './pages/dashboard/Overview';
import { CreatePoster } from './pages/dashboard/CreatePoster';
import { PrintQueue } from './pages/dashboard/PrintQueue';
import { Products } from './pages/dashboard/Products';
import { Templates } from './pages/dashboard/Templates';
import { Settings } from './pages/dashboard/Settings';
import { Admin } from './pages/dashboard/Admin';
import { SystemSettings } from './pages/dashboard/SystemSettings';
import { PrintView } from './pages/PrintView';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Landing />} /> 
        <Route path="/pricing" element={<Landing />} /> 
        <Route path="/contact" element={<Landing />} /> 
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/print" element={
         <ProtectedRoute>
            <PrintView />
         </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Overview />} />
        <Route path="create" element={<CreatePoster />} />
        <Route path="queue" element={<PrintQueue />} />
        <Route path="products" element={<Products />} />
        <Route path="templates" element={<Templates />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<Admin />} />
        <Route path="admin/settings" element={<SystemSettings />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

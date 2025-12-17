import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import NominationPage from './pages/NominationPage';
import ResultsPage from './pages/ResultsPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNominations from './pages/admin/AdminNominations';
import { DataService } from './services/dataService';

// Auth Guard Component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const user = DataService.getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><NominationPage /></Layout>} />
        <Route path="/resultados" element={<Layout><ResultsPage /></Layout>} />
        
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/indicacoes" element={
          <ProtectedRoute>
            <Layout><AdminNominations /></Layout>
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
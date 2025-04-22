import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoresProvider } from './context/StoresContext';
import Home from './routes/Home';
import StoreDetailsPage from './routes/StoreDetailsPage';
import UpdatePage from './routes/UpdatePage';
import SignupPage from './routes/SignupPage';
import LoginPage from './routes/LoginPage';
import PasswordUpdatePage from './routes/PasswordUpdatePage';
import AdminDashboardPage from './routes/AdminDashboardPage';
import OwnerDashboardPage from './routes/OwnerDashboardPage';
import AddStore from './components/AddStore';
import ProtectedRoute from './components/ProtectedRoute';


const App = () => {
  return (
    <AuthProvider>
      <StoresProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/stores/:id" element={<StoreDetailsPage />} />
            <Route path="/stores/add" element={<ProtectedRoute roles={['admin', 'owner']}><AddStore /></ProtectedRoute>} />
            <Route path="/stores/:id/update" element={<ProtectedRoute roles={['admin', 'owner']}><UpdatePage /></ProtectedRoute>} />
            <Route path="/users/password" element={<ProtectedRoute roles={['admin', 'user', 'owner']}><PasswordUpdatePage /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/owner/dashboard" element={<ProtectedRoute roles={['owner']}><OwnerDashboardPage /></ProtectedRoute>} />
            <Route path="*" element={<h1 className="text-center mt-5">Page Not Found</h1>} />
          </Routes>
        </Router>
      </StoresProvider>
    </AuthProvider>
  );
};

export default App;
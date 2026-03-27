import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './slices/authSlice';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import LoginPage from './pages/LoginPage';
import OTPPage from './pages/OTPPage';
import Dashboard from './pages/Dashboard';
import TableSelection from './pages/TableSelection';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminOTPPage from './pages/admin/AdminOTPPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMenu from './pages/admin/AdminMenu';
import AdminTables from './pages/admin/AdminTables';
import AdminSettings from './pages/admin/AdminSettings';

// Components
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import BottomNav from './components/BottomNav';

const AppContent = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPath = location.pathname.includes('/login') || location.pathname.includes('/verify-otp');

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/admin/login" />;
    if (user?.role !== 'admin') return <Navigate to="/" />;
    return (
      <div className="admin-layout flex flex-col md:flex-row min-h-screen bg-surface">
        <AdminHeader />
        <AdminSidebar />
        <div className="flex-1 transition-all duration-300 md:pl-64 pt-16 pb-24 md:pb-0">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {!isAdminPath && isAuthenticated && user?.role === 'user' && <Navbar />}
      {!isAdminPath && isAuthenticated && user?.role === 'user' && <BottomNav />}
      <CartDrawer />
      <Routes>
        {/* User Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OTPPage />} />
        <Route path="/" element={isAuthenticated ? (user?.role === 'admin' ? <Navigate to="/admin" /> : <Dashboard />) : <Navigate to="/login" />} />
        <Route path="/select-table" element={<TableSelection />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/verify-otp" element={<AdminOTPPage />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/menu" element={<AdminRoute><AdminMenu /></AdminRoute>} />
        <Route path="/admin/tables" element={<AdminRoute><AdminTables /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Browse from './pages/public/Browse';
import ResourceDetails from './pages/public/ResourceDetails';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';

// Student Pages
import Dashboard from './pages/student/Dashboard';
import UploadResource from './pages/student/UploadResource';
import EditResource from './pages/student/EditResource';
import MyResources from './pages/student/MyResources';
import MyBookmarks from './pages/student/MyBookmarks';
import DownloadHistory from './pages/student/DownloadHistory';
import CreditHistory from './pages/student/CreditHistory';
import Profile from './pages/student/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageResources from './pages/admin/ManageResources';
import ManageUsers from './pages/admin/ManageUsers';
import ManageReports from './pages/admin/ManageReports';
import ManageCategories from './pages/admin/ManageCategories';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/resources/:id" element={<ResourceDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Protected Student Portal Routes with DashboardLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadResource />} />
            <Route path="/my-resources" element={<MyResources />} />
            <Route path="/my-resources/edit/:id" element={<EditResource />} />
            <Route path="/bookmarks" element={<MyBookmarks />} />
            <Route path="/downloads" element={<DownloadHistory />} />
            <Route path="/credits" element={<CreditHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Protected Admin Portal Routes with AdminLayout */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="resources" element={<ManageResources />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="reports" element={<ManageReports />} />
            <Route path="categories" element={<ManageCategories />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

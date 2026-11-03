import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';
import AdminLayout from './layouts/AdminLayout';

// Routes Guard
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import DoctorLogin from './pages/public/DoctorLogin';
import DoctorRegister from './pages/public/DoctorRegister';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import DoctorList from './pages/public/DoctorList';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import AIAssistant from './pages/patient/AIAssistant';
import PatientProfile from './pages/patient/PatientProfile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorSettings from './pages/doctor/DoctorSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import PatientManagement from './pages/admin/PatientManagement';

// Receptionist Pages
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/doctor/register" element={<DoctorRegister />} />
            <Route path="/doctor-register" element={<DoctorRegister />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/doctors" element={<DoctorList />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            {/* Patient Routes */}
            <Route element={<RoleRoute allowedRoles="patient" />}>
              <Route element={<PatientLayout />}>
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/doctors" element={<DoctorList />} />
                <Route path="/patient/appointments" element={<PatientAppointments />} />
                <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
                <Route path="/patient/ai-assistant" element={<AIAssistant />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
              </Route>
            </Route>

            {/* Doctor Routes */}
            <Route element={<RoleRoute allowedRoles="doctor" />}>
              <Route element={<DoctorLayout />}>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
                <Route path="/doctor/settings" element={<DoctorSettings />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<RoleRoute allowedRoles="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/doctors" element={<DoctorManagement />} />
                <Route path="/admin/patients" element={<PatientManagement />} />
              </Route>
            </Route>

            {/* Receptionist Routes */}
            <Route element={<RoleRoute allowedRoles="receptionist" />}>
              <Route element={<PatientLayout />}>
                <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </AuthProvider>
  );
}

export default App;

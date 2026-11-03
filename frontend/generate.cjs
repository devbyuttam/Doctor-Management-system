const fs = require('fs');
const path = require('path');

const baseDir = 'd:/doctor_management_system/frontend/src';

const files = {
  // main.jsx
  'main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`,
  // index.css
  'index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-spin {
    animation: spin 1s linear infinite;
  }
}
`,
  // api/axios.js
  'api/axios.js': `import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: redirect to login or handle session expiration
    }
    return Promise.reject(error);
  }
);

export default api;
`,
  // context/AuthContext.jsx
  'context/AuthContext.jsx': `import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        setRole(data.user.role);
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.user);
    setRole(data.user.role);
    setIsAuthenticated(true);
    return data.user;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
`,
  // routes/PrivateRoute.jsx
  'routes/PrivateRoute.jsx': `import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) return <LoadingSpinner />;
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
`,
  // routes/RoleRoute.jsx
  'routes/RoleRoute.jsx': `import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoleRoute = ({ allowedRole }) => {
  const { role, loading } = useContext(AuthContext);
  
  if (loading) return <LoadingSpinner />;
  
  return role === allowedRole ? <Outlet /> : <Navigate to="/" />;
};

export default RoleRoute;
`,
  // components/common/LoadingSpinner.jsx
  'components/common/LoadingSpinner.jsx': `import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full w-full py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default LoadingSpinner;
`,
  // components/common/EmptyState.jsx
  'components/common/EmptyState.jsx': `import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
      {Icon && <Icon className="w-12 h-12 text-gray-400 mb-4" />}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
`,
  // components/common/ErrorMessage.jsx
  'components/common/ErrorMessage.jsx': `import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span className="block sm:inline">{message || 'An error occurred.'}</span>
    </div>
  );
};

export default ErrorMessage;
`,
  // layouts/PublicLayout.jsx
  'layouts/PublicLayout.jsx': `import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b p-4 text-center">
        <h1 className="text-xl font-bold text-primary-600">Doctor Appointment System</h1>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2026 Doctor Appointment System</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
`,
  // layouts/PatientLayout.jsx
  'layouts/PatientLayout.jsx': `import React from 'react';
import { Outlet } from 'react-router-dom';

const PatientLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-primary-600">Patient Portal</h2>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/patient/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded">Dashboard</a>
          <a href="/patient/appointments" className="block px-4 py-2 hover:bg-gray-100 rounded">Appointments</a>
        </nav>
      </aside>
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
`,
  // pages/public/Home.jsx
  'pages/public/Home.jsx': `import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Activity } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find a Doctor & Book Appointment</h1>
        <p className="text-lg text-gray-600 mb-8">Fast, reliable, and convenient healthcare at your fingertips.</p>
        <div className="space-x-4">
          <a href="/doctors" className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700">Find a Doctor</a>
          <a href="/login" className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50">Login</a>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Statistics</h2>
        {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : !stats ? <EmptyState icon={Activity} title="No stats available" /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <h3 className="text-gray-500 text-sm font-medium">Total Doctors</h3>
              <p className="text-3xl font-bold text-primary-600 mt-2">{stats.totalDoctors || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <h3 className="text-gray-500 text-sm font-medium">Total Patients</h3>
              <p className="text-3xl font-bold text-primary-600 mt-2">{stats.totalPatients || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <h3 className="text-gray-500 text-sm font-medium">Appointments</h3>
              <p className="text-3xl font-bold text-primary-600 mt-2">{stats.totalAppointments || 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
`,
  // pages/public/Login.jsx
  'pages/public/Login.jsx': `import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success('Logged in successfully');
      navigate(\`/\${user.role}/dashboard\`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md border w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              {...register('email', { required: 'Email is required' })} 
              className="w-full border rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500" 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              {...register('password', { required: 'Password is required' })} 
              className="w-full border rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500" 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
`,
  // App.jsx
  'App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import PatientLayout from './layouts/PatientLayout';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

import Home from './pages/public/Home';
import Login from './pages/public/Login';

const DashboardStub = ({ role }) => <div className="p-6 text-xl">Welcome to {role} Dashboard</div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Route>
          
          <Route element={<PrivateRoute />}>
            <Route element={<RoleRoute allowedRole="patient" />}>
              <Route element={<PatientLayout />}>
                <Route path="/patient/dashboard" element={<DashboardStub role="Patient" />} />
                <Route path="/patient/appointments" element={<DashboardStub role="Patient Appointments" />} />
              </Route>
            </Route>
            
            <Route element={<RoleRoute allowedRole="doctor" />}>
              <Route path="/doctor/dashboard" element={<DashboardStub role="Doctor" />} />
            </Route>
            
            <Route element={<RoleRoute allowedRole="admin" />}>
              <Route path="/admin/dashboard" element={<DashboardStub role="Admin" />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
`
};

for (const [relativePath, content] of Object.entries(files)) {
  const absolutePath = path.join(baseDir, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log('Created:', absolutePath);
}

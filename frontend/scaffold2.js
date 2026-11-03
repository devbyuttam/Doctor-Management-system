import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

const filesToCreate = {
  // patient pages
  'pages/patient/Dashboard.jsx': `export default function Dashboard() { return <div className="p-8"><h1>Patient Dashboard</h1></div>; }`,
  'pages/patient/FindDoctors.jsx': `export default function FindDoctors() { return <div className="p-8"><h1>Find Doctors</h1></div>; }`,
  'pages/patient/BookAppointment.jsx': `export default function BookAppointment() { return <div className="p-8"><h1>Book Appointment</h1></div>; }`,
  'pages/patient/Appointments.jsx': `export default function Appointments() { return <div className="p-8"><h1>My Appointments</h1></div>; }`,
  'pages/patient/AppointmentDetail.jsx': `export default function AppointmentDetail() { return <div className="p-8"><h1>Appointment Detail</h1></div>; }`,
  'pages/patient/MedicalRecords.jsx': `export default function MedicalRecords() { return <div className="p-8"><h1>Medical Records</h1></div>; }`,
  'pages/patient/Prescriptions.jsx': `export default function Prescriptions() { return <div className="p-8"><h1>Prescriptions</h1></div>; }`,
  'pages/patient/Payments.jsx': `export default function Payments() { return <div className="p-8"><h1>Payments</h1></div>; }`,
  'pages/patient/Notifications.jsx': `export default function Notifications() { return <div className="p-8"><h1>Notifications</h1></div>; }`,
  'pages/patient/Profile.jsx': `export default function Profile() { return <div className="p-8"><h1>Profile</h1></div>; }`,

  // doctor pages
  'pages/doctor/Dashboard.jsx': `export default function Dashboard() { return <div className="p-8"><h1>Doctor Dashboard</h1></div>; }`,
  'pages/doctor/Appointments.jsx': `export default function Appointments() { return <div className="p-8"><h1>Appointments</h1></div>; }`,
  'pages/doctor/AppointmentDetail.jsx': `export default function AppointmentDetail() { return <div className="p-8"><h1>Appointment Detail</h1></div>; }`,
  'pages/doctor/Patients.jsx': `export default function Patients() { return <div className="p-8"><h1>Patients</h1></div>; }`,
  'pages/doctor/MedicalRecords.jsx': `export default function MedicalRecords() { return <div className="p-8"><h1>Medical Records</h1></div>; }`,
  'pages/doctor/Prescriptions.jsx': `export default function Prescriptions() { return <div className="p-8"><h1>Prescriptions</h1></div>; }`,
  'pages/doctor/Availability.jsx': `export default function Availability() { return <div className="p-8"><h1>Availability</h1></div>; }`,
  'pages/doctor/Reviews.jsx': `export default function Reviews() { return <div className="p-8"><h1>Reviews</h1></div>; }`,
  'pages/doctor/Profile.jsx': `export default function Profile() { return <div className="p-8"><h1>Profile</h1></div>; }`,

  // receptionist pages
  'pages/receptionist/Dashboard.jsx': `export default function Dashboard() { return <div className="p-8"><h1>Receptionist Dashboard</h1></div>; }`,
  'pages/receptionist/RegisterPatient.jsx': `export default function RegisterPatient() { return <div className="p-8"><h1>Register Patient</h1></div>; }`,
  'pages/receptionist/WalkInAppointment.jsx': `export default function WalkInAppointment() { return <div className="p-8"><h1>Walk-in Appointment</h1></div>; }`,
  'pages/receptionist/QueueManagement.jsx': `export default function QueueManagement() { return <div className="p-8"><h1>Queue Management</h1></div>; }`,
  'pages/receptionist/TodayAppointments.jsx': `export default function TodayAppointments() { return <div className="p-8"><h1>Today's Appointments</h1></div>; }`,

  // admin pages
  'pages/admin/Dashboard.jsx': `export default function Dashboard() { return <div className="p-8"><h1>Admin Dashboard</h1></div>; }`,
  'pages/admin/Doctors.jsx': `export default function Doctors() { return <div className="p-8"><h1>Doctors</h1></div>; }`,
  'pages/admin/Patients.jsx': `export default function Patients() { return <div className="p-8"><h1>Patients</h1></div>; }`,
  'pages/admin/Receptionists.jsx': `export default function Receptionists() { return <div className="p-8"><h1>Receptionists</h1></div>; }`,
  'pages/admin/Appointments.jsx': `export default function Appointments() { return <div className="p-8"><h1>Appointments</h1></div>; }`,
  'pages/admin/Departments.jsx': `export default function Departments() { return <div className="p-8"><h1>Departments</h1></div>; }`,
  'pages/admin/Payments.jsx': `export default function Payments() { return <div className="p-8"><h1>Payments</h1></div>; }`,
  'pages/admin/Reviews.jsx': `export default function Reviews() { return <div className="p-8"><h1>Reviews</h1></div>; }`,
  'pages/admin/Reports.jsx': `export default function Reports() { return <div className="p-8"><h1>Reports</h1></div>; }`,
  'pages/admin/Settings.jsx': `export default function Settings() { return <div className="p-8"><h1>Settings</h1></div>; }`,

  // layouts
  'layouts/PatientLayout.jsx': `import { Outlet } from 'react-router-dom'; export default function PatientLayout() { return <div><nav className="bg-blue-600 text-white p-4">Patient Portal</nav><div className="p-4"><Outlet /></div></div>; }`,
  'layouts/DoctorLayout.jsx': `import { Outlet } from 'react-router-dom'; export default function DoctorLayout() { return <div><nav className="bg-green-600 text-white p-4">Doctor Portal</nav><div className="p-4"><Outlet /></div></div>; }`,
  'layouts/ReceptionistLayout.jsx': `import { Outlet } from 'react-router-dom'; export default function ReceptionistLayout() { return <div><nav className="bg-purple-600 text-white p-4">Receptionist Portal</nav><div className="p-4"><Outlet /></div></div>; }`,
  'layouts/AdminLayout.jsx': `import { Outlet } from 'react-router-dom'; export default function AdminLayout() { return <div><nav className="bg-gray-800 text-white p-4">Admin Portal</nav><div className="p-4"><Outlet /></div></div>; }`,
  
  // hooks
  'hooks/useSocket.js': `import { useContext } from 'react'; import { SocketContext } from '../context/SocketContext'; export function useSocket() { return useContext(SocketContext); }`,
  'hooks/useDebounce.js': `import { useState, useEffect } from 'react'; export function useDebounce(value, delay) { const [debouncedValue, setDebouncedValue] = useState(value); useEffect(() => { const handler = setTimeout(() => { setDebouncedValue(value); }, delay); return () => clearTimeout(handler); }, [value, delay]); return debouncedValue; }`,
  'hooks/useNotifications.js': `import { useState, useEffect } from 'react'; import { useSocket } from './useSocket'; export function useNotifications() { const socket = useSocket(); const [notifications, setNotifications] = useState([]); useEffect(() => { if (!socket) return; socket.on('notification', (msg) => { setNotifications(prev => [msg, ...prev]); }); return () => socket.off('notification'); }, [socket]); return { notifications }; }`,

  // common components
  'components/common/Navbar.jsx': `export default function Navbar() { return <nav>Navbar</nav>; }`,
  'components/common/Footer.jsx': `export default function Footer() { return <footer>Footer</footer>; }`,
  'components/common/Sidebar.jsx': `export default function Sidebar() { return <aside>Sidebar</aside>; }`,
  'components/common/ErrorMessage.jsx': `export default function ErrorMessage({ message }) { return <div className="text-red-500">{message}</div>; }`,
  'components/common/ConfirmModal.jsx': `export default function ConfirmModal({ isOpen }) { return isOpen ? <div>Modal</div> : null; }`,
  'components/common/Pagination.jsx': `export default function Pagination() { return <div>Pagination</div>; }`,
  'components/common/Badge.jsx': `export default function Badge({ text }) { return <span>{text}</span>; }`,

  // domain components
  'components/doctors/DoctorCard.jsx': `export default function DoctorCard() { return <div>DoctorCard</div>; }`,
  'components/doctors/DoctorSearchFilters.jsx': `export default function DoctorSearchFilters() { return <div>Filters</div>; }`,
  'components/doctors/SlotPicker.jsx': `export default function SlotPicker() { return <div>SlotPicker</div>; }`,
  'components/appointments/AppointmentCard.jsx': `export default function AppointmentCard() { return <div>AppointmentCard</div>; }`,
  'components/appointments/AppointmentStatusBadge.jsx': `export default function AppointmentStatusBadge() { return <div>Badge</div>; }`,
  'components/charts/AppointmentsChart.jsx': `export default function AppointmentsChart() { return <div>Chart</div>; }`,
  'components/charts/RevenueChart.jsx': `export default function RevenueChart() { return <div>Chart</div>; }`,
  'components/charts/SpecializationChart.jsx': `export default function SpecializationChart() { return <div>Chart</div>; }`,
  'components/notifications/NotificationBell.jsx': `export default function NotificationBell() { return <div>Bell</div>; }`,
  
  // missing context
  'context/NotificationContext.jsx': `import { createContext } from 'react'; export const NotificationContext = createContext(null); export function NotificationProvider({ children }) { return <NotificationContext.Provider value={{}}>{children}</NotificationContext.Provider>; }`,
};

Object.entries(filesToCreate).forEach(([filePath, content]) => {
  const fullPath = path.join(srcDir, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
});

console.log('Scaffolding 2 complete.');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const filesToCreate = {
  'api/authApi.js': `import api from './axios.js';\nexport const login = (data) => api.post('/auth/login', data);\nexport const register = (data) => api.post('/auth/register', data);\nexport const logout = () => api.post('/auth/logout');\n`,
  'api/doctorApi.js': `import api from './axios.js';\nexport const getDoctors = (params) => api.get('/doctors', { params });\nexport const getDoctor = (id) => api.get(\`/doctors/\${id}\`);\n`,
  'api/patientApi.js': `import api from './axios.js';\nexport const getProfile = () => api.get('/patients/profile');\n`,
  'api/appointmentApi.js': `import api from './axios.js';\nexport const getAppointments = (params) => api.get('/appointments', { params });\nexport const bookAppointment = (data) => api.post('/appointments', data);\n`,
  'api/medicalRecordApi.js': `import api from './axios.js';\nexport const getRecords = () => api.get('/medical-records');\n`,
  'api/prescriptionApi.js': `import api from './axios.js';\nexport const getPrescriptions = () => api.get('/prescriptions');\n`,
  'api/paymentApi.js': `import api from './axios.js';\nexport const createOrder = (data) => api.post('/payments/create-order', data);\nexport const verifyPayment = (data) => api.post('/payments/verify', data);\n`,
  'api/reviewApi.js': `import api from './axios.js';\nexport const getReviews = (doctorId) => api.get(\`/reviews/doctor/\${doctorId}\`);\n`,
  'api/notificationApi.js': `import api from './axios.js';\nexport const getNotifications = () => api.get('/notifications');\n`,
  'api/uploadApi.js': `import api from './axios.js';\nexport const uploadImage = (data) => api.post('/upload/profile-image', data);\n`,
  'api/aiApi.js': `import api from './axios.js';\nexport const chatAI = (data) => api.post('/ai/chat', data);\n`,
  'api/adminApi.js': `import api from './axios.js';\nexport const getDashboard = () => api.get('/admin/dashboard');\n`,
  'utils/dateHelpers.js': `import { format } from 'date-fns';\nexport const formatDate = (date) => format(new Date(date), 'PP');\n`,
  'utils/formatters.js': `export const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);\n`,
  'pages/public/Home.jsx': `export default function Home() { return <div className="p-8"><h1>Home</h1></div>; }`,
  'pages/public/Login.jsx': `export default function Login() { return <div className="p-8"><h1>Login</h1></div>; }`,
  'pages/public/Register.jsx': `export default function Register() { return <div className="p-8"><h1>Register</h1></div>; }`,
  'pages/public/Doctors.jsx': `export default function Doctors() { return <div className="p-8"><h1>Doctors</h1></div>; }`,
  'pages/public/About.jsx': `export default function About() { return <div className="p-8"><h1>About</h1></div>; }`,
  'pages/public/DoctorDetails.jsx': `export default function DoctorDetails() { return <div className="p-8"><h1>Doctor Details</h1></div>; }`,
  'pages/public/ForgotPassword.jsx': `export default function ForgotPassword() { return <div className="p-8"><h1>Forgot Password</h1></div>; }`,
  'pages/public/ResetPassword.jsx': `export default function ResetPassword() { return <div className="p-8"><h1>Reset Password</h1></div>; }`,
  'pages/public/Contact.jsx': `export default function Contact() { return <div className="p-8"><h1>Contact</h1></div>; }`,
  'pages/public/NotFound.jsx': `export default function NotFound() { return <div className="p-8"><h1>404 Not Found</h1></div>; }`,
};

Object.entries(filesToCreate).forEach(([filePath, content]) => {
  const fullPath = path.join(srcDir, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
});

console.log('Scaffolding complete.');

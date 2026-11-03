import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AIChatWidget from '../components/common/AIChatWidget';
import { Heart, Stethoscope, Mail, Phone, MapPin } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-800">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              MediCare Platform
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering healthcare access with seamless online doctor appointments, queue tracking, smart records, and AI assistance.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/doctors" className="hover:text-blue-400 transition">Find a Doctor</a></li>
              <li><a href="/login" className="hover:text-blue-400 transition">Patient Portal</a></li>
              <li><a href="/login" className="hover:text-blue-400 transition">Doctor Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Specialties</h4>
            <ul className="space-y-2 text-sm">
              <li>General Medicine</li>
              <li>Cardiology</li>
              <li>Pediatrics</li>
              <li>Dermatology</li>
              <li>Orthopedics</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold mb-4">Contact Us</h4>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-blue-500" />
              <span>+1 (800) 555-CARE</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>support@medicare.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>100 Health Plaza, Medical City</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 MediCare Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for better healthcare
          </p>
        </div>
      </footer>
      <AIChatWidget />
    </div>
  );
};

export default PublicLayout;

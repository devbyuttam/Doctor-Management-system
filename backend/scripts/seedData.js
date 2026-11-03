/**
 * seedData.js — Comprehensive seed script for the Doctor Management System
 * Creates: 1 admin, 5 doctors (with full profiles), 5 patients
 * Usage: node scripts/seedData.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
const DoctorRegistry = require('../src/models/DoctorRegistry');
const doctorRegistryData = require('../src/data/doctorRegistryData');

dotenv.config({ path: './.env' });

// ─── VIRTUAL DATA ────────────────────────────────────────────────────────────

const adminData = {
  name: 'System Administrator',
  email: 'admin@hospital.com',
  passwordHash: 'Admin@123456',
  role: 'admin',
  phone: '+91-9000000001',
  status: 'active',
};

const doctorsData = [
  {
    user: {
      name: 'Dr. Anika Sharma',
      email: 'doctor@hospital.com',
      passwordHash: 'Doctor@123456',
      role: 'doctor',
      phone: '+91-9811234567',
      status: 'active',
    },
    profile: {
      specialization: 'Cardiologist',
      experience: 12,
      consultationFee: 800,
      about: 'Expert cardiologist with 12 years of experience in treating complex heart conditions.',
      gender: 'female',
      languages: ['English', 'Hindi'],
      verificationStatus: 'approved',
      isAvailable: true,
      averageRating: 4.8,
      totalReviews: 134,
      qualifications: [
        { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2008 },
        { degree: 'MD (Cardiology)', institution: 'PGI Chandigarh', year: 2012 },
      ],
      clinic: { name: 'Heart Care Clinic', address: '12, MG Road', city: 'Delhi' },
      location: { city: 'Delhi', state: 'Delhi', country: 'India' },
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '14:00', slotDurationMinutes: 30, isAvailable: true },
        { day: 'Wednesday', startTime: '09:00', endTime: '14:00', slotDurationMinutes: 30, isAvailable: true },
        { day: 'Friday', startTime: '10:00', endTime: '15:00', slotDurationMinutes: 30, isAvailable: true },
      ],
    },
  },
  {
    user: {
      name: 'Dr. Rohan Mehta',
      email: 'doctor2@hospital.com',
      passwordHash: 'Doctor@123456',
      role: 'doctor',
      phone: '+91-9822345678',
      status: 'active',
    },
    profile: {
      specialization: 'Orthopedic Surgeon',
      experience: 9,
      consultationFee: 700,
      about: 'Specialist in joint replacement and sports injury rehabilitation.',
      gender: 'male',
      languages: ['English', 'Marathi'],
      verificationStatus: 'approved',
      isAvailable: true,
      averageRating: 4.6,
      totalReviews: 89,
      qualifications: [
        { degree: 'MBBS', institution: 'Seth GS Medical College', year: 2010 },
        { degree: 'MS (Ortho)', institution: 'KEM Hospital Mumbai', year: 2014 },
      ],
      clinic: { name: 'Bone & Joint Clinic', address: '7, Andheri West', city: 'Mumbai' },
      location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
      availability: [
        { day: 'Tuesday', startTime: '10:00', endTime: '16:00', slotDurationMinutes: 30, isAvailable: true },
        { day: 'Thursday', startTime: '10:00', endTime: '16:00', slotDurationMinutes: 30, isAvailable: true },
        { day: 'Saturday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 30, isAvailable: true },
      ],
    },
  },
  {
    user: {
      name: 'Dr. Priya Nair',
      email: 'doctor3@hospital.com',
      passwordHash: 'Doctor@123456',
      role: 'doctor',
      phone: '+91-9833456789',
      status: 'active',
    },
    profile: {
      specialization: 'Dermatologist',
      experience: 7,
      consultationFee: 600,
      about: 'Renowned dermatologist specializing in cosmetic and medical dermatology.',
      gender: 'female',
      languages: ['English', 'Malayalam', 'Tamil'],
      verificationStatus: 'approved',
      isAvailable: true,
      averageRating: 4.9,
      totalReviews: 211,
      qualifications: [
        { degree: 'MBBS', institution: 'Trivandrum Medical College', year: 2012 },
        { degree: 'MD (Dermatology)', institution: 'JIPMER Puducherry', year: 2016 },
      ],
      clinic: { name: 'Skin & Shine Clinic', address: '22, Brigade Road', city: 'Bangalore' },
      location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
      availability: [
        { day: 'Monday', startTime: '11:00', endTime: '17:00', slotDurationMinutes: 20, isAvailable: true },
        { day: 'Wednesday', startTime: '11:00', endTime: '17:00', slotDurationMinutes: 20, isAvailable: true },
        { day: 'Friday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 20, isAvailable: true },
      ],
    },
  },
  {
    user: {
      name: 'Dr. Arjun Kapoor',
      email: 'doctor4@hospital.com',
      passwordHash: 'Doctor@123456',
      role: 'doctor',
      phone: '+91-9844567890',
      status: 'active',
    },
    profile: {
      specialization: 'Neurologist',
      experience: 15,
      consultationFee: 1000,
      about: 'Senior neurologist with expertise in epilepsy, Parkinson\'s and stroke management.',
      gender: 'male',
      languages: ['English', 'Hindi', 'Punjabi'],
      verificationStatus: 'approved',
      isAvailable: true,
      averageRating: 4.7,
      totalReviews: 178,
      qualifications: [
        { degree: 'MBBS', institution: 'AIIMS New Delhi', year: 2005 },
        { degree: 'DM (Neurology)', institution: 'NIMHANS Bangalore', year: 2010 },
      ],
      clinic: { name: 'NeuroLife Centre', address: '5, Connaught Place', city: 'Delhi' },
      location: { city: 'Delhi', state: 'Delhi', country: 'India' },
      availability: [
        { day: 'Tuesday', startTime: '08:00', endTime: '13:00', slotDurationMinutes: 30, isAvailable: true },
        { day: 'Thursday', startTime: '08:00', endTime: '13:00', slotDurationMinutes: 30, isAvailable: true },
      ],
    },
  },
  {
    user: {
      name: 'Dr. Kavitha Reddy',
      email: 'doctor5@hospital.com',
      passwordHash: 'Doctor@123456',
      role: 'doctor',
      phone: '+91-9855678901',
      status: 'active',
    },
    profile: {
      specialization: 'Pediatrician',
      experience: 10,
      consultationFee: 500,
      about: 'Child health specialist caring for infants to teenagers with compassion.',
      gender: 'female',
      languages: ['English', 'Telugu', 'Kannada'],
      verificationStatus: 'approved',
      isAvailable: true,
      averageRating: 4.9,
      totalReviews: 302,
      qualifications: [
        { degree: 'MBBS', institution: 'Osmania Medical College', year: 2009 },
        { degree: 'MD (Pediatrics)', institution: 'Nizam\'s Institute, Hyderabad', year: 2013 },
      ],
      clinic: { name: 'Little Stars Clinic', address: '3, Jubilee Hills', city: 'Hyderabad' },
      location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 15, isAvailable: true },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 15, isAvailable: true },
        { day: 'Saturday', startTime: '09:00', endTime: '14:00', slotDurationMinutes: 15, isAvailable: true },
      ],
    },
  },
];

const patientsData = [
  {
    user: {
      name: 'Rahul Verma',
      email: 'patient@hospital.com',
      passwordHash: 'Patient@123456',
      role: 'patient',
      phone: '+91-9876543210',
      status: 'active',
    },
    profile: {
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      address: { street: '45, Karol Bagh', city: 'Delhi', state: 'Delhi', country: 'India', pincode: '110005' },
      bloodGroup: 'O+',
      allergies: ['Penicillin'],
      medicalHistory: [{ condition: 'Hypertension', diagnosedYear: 2019, notes: 'Controlled with medication' }],
    },
  },
  {
    user: {
      name: 'Sunita Joshi',
      email: 'patient2@hospital.com',
      passwordHash: 'Patient@123456',
      role: 'patient',
      phone: '+91-9877654321',
      status: 'active',
    },
    profile: {
      dateOfBirth: new Date('1985-11-22'),
      gender: 'female',
      bloodGroup: 'A+',
      allergies: [],
      medicalHistory: [],
    },
  },
  {
    user: {
      name: 'Amit Desai',
      email: 'patient3@hospital.com',
      passwordHash: 'Patient@123456',
      role: 'patient',
      phone: '+91-9878765432',
      status: 'active',
    },
    profile: {
      dateOfBirth: new Date('2000-03-10'),
      gender: 'male',
      bloodGroup: 'B+',
      allergies: ['Aspirin'],
      medicalHistory: [{ condition: 'Asthma', diagnosedYear: 2010, notes: 'Mild; managed with inhaler' }],
    },
  },
  {
    user: {
      name: 'Meera Pillai',
      email: 'patient4@hospital.com',
      passwordHash: 'Patient@123456',
      role: 'patient',
      phone: '+91-9879876543',
      status: 'active',
    },
    profile: {
      dateOfBirth: new Date('1978-08-05'),
      gender: 'female',
      bloodGroup: 'AB-',
      allergies: ['Sulfa drugs'],
      medicalHistory: [{ condition: 'Type 2 Diabetes', diagnosedYear: 2015, notes: 'Diet + medication controlled' }],
    },
  },
  {
    user: {
      name: 'Kiran Rao',
      email: 'patient5@hospital.com',
      passwordHash: 'Patient@123456',
      role: 'patient',
      phone: '+91-9870987654',
      status: 'active',
    },
    profile: {
      dateOfBirth: new Date('1995-12-28'),
      gender: 'male',
      bloodGroup: 'O-',
      allergies: [],
      medicalHistory: [],
    },
  },
];

const receptionistData = {
  name: 'Sneha Kulkarni',
  email: 'receptionist@hospital.com',
  passwordHash: 'Receptionist@123',
  role: 'receptionist',
  phone: '+91-9000000002',
  status: 'active',
};

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('\n✅  MongoDB connected\n');

    // ── Admin ──
    const adminExists = await User.findOne({ email: adminData.email });
    if (!adminExists) {
      await User.create(adminData);
      console.log(`👤  Admin created      → ${adminData.email}  |  password: ${adminData.passwordHash}`);
    } else {
      console.log(`⏭   Admin already exists → ${adminData.email}`);
    }

    // ── Receptionist ──
    const recepExists = await User.findOne({ email: receptionistData.email });
    if (!recepExists) {
      await User.create(receptionistData);
      console.log(`👤  Receptionist created → ${receptionistData.email}  |  password: ${receptionistData.passwordHash}`);
    } else {
      console.log(`⏭   Receptionist already exists → ${receptionistData.email}`);
    }

    // ── 100 Pre-Authorized Doctors Registry ──
    console.log('\n─── 100 PRE-AUTHORIZED DOCTOR REGISTRY (DOC-1001 to DOC-1100) ───');
    let insertedCount = 0;
    for (const item of doctorRegistryData) {
      const regExists = await DoctorRegistry.findOne({ doctorId: item.doctorId });
      if (!regExists) {
        await DoctorRegistry.create(item);
        insertedCount++;
      }
    }
    console.log(`📋  100 Doctor Registry synced: ${insertedCount} new pre-authorized IDs initialized.`);

    // ── Doctors ──
    console.log('\n─── DOCTORS ────────────────────────────────────────');
    for (let i = 0; i < doctorsData.length; i++) {
      const doc = doctorsData[i];
      const assignedId = `DOC-${1001 + i}`;
      const exists = await User.findOne({ email: doc.user.email });
      if (!exists) {
        const user = await User.create({ ...doc.user, doctorId: assignedId });
        await Doctor.create({ userId: user._id, doctorId: assignedId, ...doc.profile });
        await DoctorRegistry.updateOne(
          { doctorId: assignedId },
          { isRegistered: true, registeredUserId: user._id, registeredAt: new Date() }
        );
        console.log(`🩺  Doctor created [${assignedId}] → ${doc.user.email}  |  password: ${doc.user.passwordHash}`);
      } else {
        console.log(`⏭   Doctor already exists [${assignedId}] → ${doc.user.email}`);
      }
    }

    // ── Patients ──
    console.log('\n─── PATIENTS ───────────────────────────────────────');
    for (const pat of patientsData) {
      const exists = await User.findOne({ email: pat.user.email });
      if (!exists) {
        const user = await User.create(pat.user);
        await Patient.create({ userId: user._id, ...pat.profile });
        console.log(`🙎  Patient created     → ${pat.user.email}  |  password: ${pat.user.passwordHash}`);
      } else {
        console.log(`⏭   Patient already exists → ${pat.user.email}`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('🎉  Seed completed successfully!');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Quick Login Summary:');
    console.log('  Admin       → admin@hospital.com        / Admin@123456');
    console.log('  Doctor 1    → doctor@hospital.com       / Doctor@123456');
    console.log('  Doctor 2    → doctor2@hospital.com      / Doctor@123456');
    console.log('  Doctor 3    → doctor3@hospital.com      / Doctor@123456');
    console.log('  Doctor 4    → doctor4@hospital.com      / Doctor@123456');
    console.log('  Doctor 5    → doctor5@hospital.com      / Doctor@123456');
    console.log('  Patient 1   → patient@hospital.com      / Patient@123456');
    console.log('  Patient 2   → patient2@hospital.com     / Patient@123456');
    console.log('  Receptionist→ receptionist@hospital.com / Receptionist@123\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌  Seed Error:', error.message);
    process.exit(1);
  }
};

seed();

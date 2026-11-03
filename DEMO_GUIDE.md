# MediCare — Full Working Demo Video & System Guide

## 🎬 1. How to Watch the Demo Video
A full, automated, interactive video walkthrough has been generated in your project root:
- **File**: [`demo-video.html`](file:///d:/doctor_management_system/demo-video.html)
- **To Launch**: Double-click [`demo-video.html`](file:///d:/doctor_management_system/demo-video.html) or run:
  ```powershell
  start demo-video.html
  ```
- **Features in the Player**:
  - **Live Simulated Interaction**: Watch the cursor click buttons, fill credentials, test invalid IDs, trigger live toasts, and complete bookings in real-time.
  - **Video Timeline & Progress Bar**: Play, pause, seek anywhere, change speed (1x, 1.5x, 2x), and jump directly to any chapter.
  - **Record & Download Video**: Click the top right **"Record & Download Video (.webm)"** button to export a `.webm` video recording directly to your computer.

---

## 🎞️ 2. Scenes Covered in the Demo Video

### Scene 1: Website Overview & Advanced Medical UI
- **Visuals**: Modern deep teal, emerald, and slate color theme with glassmorphism header.
- **Components**: Quick-access **"Doctor Portal"** button, hero stats (100+ Authorized Doctors, 5000+ Patients, 100% HIPAA Secure), and medical specialty pills.

### Scene 2: 100 Doctor ID Security Check & Pre-Authorized Registry
- **Action**: Enters unauthorized/fake ID `DOC-9999` and clicks **"Verify ID"**.
- **Security Result**: Hard access block:
  > *"Access Blocked: Doctor ID 'DOC-9999' is not found in the Hospital Medical Board Registry. Public registration blocked!"*
- **Verification**: Enters pre-authorized ID `DOC-1008`.
- **Approval Result**: Identity verified: Dr. Meera Deshmukh (Pediatrician, License `MCI-2018-1008`).

### Scene 3: Doctor Portal Authentication & Live Consultation Queue
- **Action**: Logs in using unique Doctor ID `DOC-1001` and password `Doctor@123456`.
- **Dashboard**: Welcome Dr. Anika Sharma (Cardiologist, ₹800 fee).
- **Live Queue**: Demonstrates real-time patient queue #08 (Rahul Verma) and clicking **"Start Consultation"** & **"Write Prescription"**.

### Scene 4: Patient Portal Login
- **Action**: Signs in with patient credentials (`patient@hospital.com` / `Patient@123456`).
- **Dashboard**: Accesses patient health portal, scheduled visits, and prescriptions history.

### Scene 5: Selecting Specialist & Live Appointment Booking
- **Action**: Selects Dr. Anika Sharma (Cardiologist, DOC-1001).
- **Slot Selection**: Picks morning slot `10:30 AM`.
- **Reason**: Routine cardiology follow-up & ECG review.
- **Confirmation**: Clicks **"Confirm & Book Appointment"** &rarr; Generates instant Token #08 with live status badge.

---

## 🔑 3. Quick Credentials for Live Testing

| Portal | Doctor ID / Email | Password | Role Details |
| :--- | :--- | :--- | :--- |
| **Doctor Portal** | `DOC-1001` *(or doctor@hospital.com)* | `Doctor@123456` | Dr. Anika Sharma (Cardiologist) |
| **Doctor Portal** | `DOC-1002` *(or doctor2@hospital.com)* | `Doctor@123456` | Dr. Rohan Mehta (Orthopedic Surgeon) |
| **Doctor Portal** | `DOC-1003` *(or doctor3@hospital.com)* | `Doctor@123456` | Dr. Priya Nair (Dermatologist) |
| **Doctor Portal** | `DOC-1004` *(or doctor4@hospital.com)* | `Doctor@123456` | Dr. Arjun Kapoor (Neurologist) |
| **Doctor Portal** | `DOC-1005` *(or doctor5@hospital.com)* | `Doctor@123456` | Dr. Kavitha Reddy (Pediatrician) |
| **Patient Portal** | `patient@hospital.com` | `Patient@123456` | Rahul Verma (Verified Patient) |
| **Admin Portal** | `admin@hospital.com` | `Admin@123456` | System Administrator |

---

## 🚀 4. How to Run the Website Locally
1. **Start Backend**:
   ```powershell
   cd d:\doctor_management_system\backend
   npm run dev
   ```
2. **Start Frontend**:
   ```powershell
   cd d:\doctor_management_system\frontend
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

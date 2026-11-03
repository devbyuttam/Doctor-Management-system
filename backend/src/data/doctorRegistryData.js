/**
 * 100 Pre-Authorized Doctors Registry Dataset
 * IDs: DOC-1001 to DOC-1100
 */

const firstNames = [
  "Aarav", "Aditi", "Ananya", "Arjun", "Deepak", "Devi", "Gaurav", "Isha", "Kavita", "Karan",
  "Manish", "Meera", "Neha", "Nikhil", "Pooja", "Pranav", "Priya", "Rahul", "Rhea", "Rohan",
  "Samir", "Sanjay", "Shreya", "Siddharth", "Simran", "Sneha", "Sunita", "Tanvi", "Varun", "Vikram",
  "Alok", "Amrita", "Anand", "Bhavna", "Chirag", "Divya", "Farhan", "Geeta", "Harish", "Indu",
  "Jatin", "Kalyani", "Lalit", "Madhuri", "Naveen", "Pallavi", "Rajesh", "Ritu", "Sachin", "Swati",
  "Abhishek", "Brijesh", "Chetan", "Deepika", "Esha", "Girish", "Hema", "Ishaan", "Jayant", "Kiran",
  "Leela", "Manoj", "Nandini", "Omkar", "Pankaj", "Radha", "Suresh", "Tarun", "Usha", "Vivek",
  "Anil", "Bina", "Chandrashekhar", "Devika", "Ekta", "Gautam", "Hansika", "Jagdish", "Kamal", "Lata",
  "Mukesh", "Nirav", "Payal", "Ramesh", "Sarita", "Trisha", "Uma", "Vikas", "Yash", "Zoya",
  "Ashok", "Bharti", "Dinesh", "Gita", "Kartik", "Mamta", "Naresh", "Preeti", "Rakesh", "Suman"
];

const lastNames = [
  "Sharma", "Verma", "Mehta", "Patel", "Reddy", "Nair", "Kapoor", "Chatterjee", "Bhattacharya", "Deshmukh",
  "Singhal", "Gupta", "Joshi", "Iyer", "Menon", "Chawla", "Bansal", "Chopra", "Saxena", "Malhotra",
  "Agrawal", "Rao", "Mishra", "Mukherjee", "Pandey", "Kulkarni", "Desai", "Pillai", "Goswami", "Sen",
  "Choudhury", "Bhardwaj", "Trivedi", "Rathore", "Dubey", "Mahajan", "Nambiar", "Shetty", "Gowda", "Hegde",
  "Thakur", "Tiwari", "Shukla", "Pathak", "Tripathi", "Upadhyay", "Acharya", "Varma", "Khatri", "Sethi"
];

const specialties = [
  { spec: "Cardiologist", dept: "Cardiovascular Sciences", fee: 900 },
  { spec: "Neurologist", dept: "Neurosciences & Stroke Unit", fee: 1000 },
  { spec: "Orthopedic Surgeon", dept: "Orthopedics & Joint Replacement", fee: 800 },
  { spec: "Pediatrician", dept: "Pediatrics & Child Health", fee: 600 },
  { spec: "Dermatologist", dept: "Dermatology & Skin Care", fee: 700 },
  { spec: "Oncologist", dept: "Medical Oncology", fee: 1200 },
  { spec: "Gastroenterologist", dept: "Digestive Diseases & Hepatology", fee: 850 },
  { spec: "Gynecologist", dept: "Obstetrics & Women's Health", fee: 750 },
  { spec: "Ophthalmologist", dept: "Eye Care & Refractive Surgery", fee: 650 },
  { spec: "ENT Specialist", dept: "Ear, Nose & Throat", fee: 600 },
  { spec: "Psychiatrist", dept: "Behavioral Sciences & Mental Health", fee: 950 },
  { spec: "Endocrinologist", dept: "Diabetes & Hormone Disorders", fee: 800 },
  { spec: "Pulmonologist", dept: "Respiratory & Sleep Medicine", fee: 850 },
  { spec: "Nephrologist", dept: "Kidney Disease & Dialysis", fee: 950 },
  { spec: "General Physician", dept: "Internal Medicine", fee: 500 }
];

const hospitalBranches = [
  "Central Hospital - Main Wing",
  "Metro Care Pavilion",
  "North City Super Specialty Wing",
  "South Wing Clinical Center",
  "Eastside Medical Complex"
];

// Generate exactly 100 doctors
const doctors100 = [];

for (let i = 1; i <= 100; i++) {
  const docNum = 1000 + i;
  const doctorId = `DOC-${docNum}`;
  const firstName = firstNames[(i - 1) % firstNames.length];
  const lastName = lastNames[(i - 1) % lastNames.length];
  const fullName = `Dr. ${firstName} ${lastName}`;
  const specialtyInfo = specialties[(i - 1) % specialties.length];
  const assignedEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${docNum}@hospital.org`;
  const licenseNum = `MCI-${2010 + (i % 14)}-${docNum}`;
  const phone = `+91-98${String(10000000 + (i * 87654)).slice(0, 8)}`;
  const experience = 4 + (i % 22); // 4 to 25 years
  const fee = specialtyInfo.fee + ((i % 5) * 50);
  const branch = hospitalBranches[i % hospitalBranches.length];

  doctors100.push({
    doctorId,
    name: fullName,
    specialization: specialtyInfo.spec,
    department: specialtyInfo.dept,
    medicalLicenseNumber: licenseNum,
    assignedEmail,
    contactPhone: phone,
    experience,
    consultationFee: fee,
    hospitalBranch: branch,
    isRegistered: false
  });
}

// Pre-activate first 5 doctors to match existing demo logins
doctors100[0].assignedEmail = "doctor@hospital.com";
doctors100[0].name = "Dr. Anika Sharma";
doctors100[0].specialization = "Cardiologist";
doctors100[0].isRegistered = true;

doctors100[1].assignedEmail = "doctor2@hospital.com";
doctors100[1].name = "Dr. Rohan Mehta";
doctors100[1].specialization = "Orthopedic Surgeon";
doctors100[1].isRegistered = true;

doctors100[2].assignedEmail = "doctor3@hospital.com";
doctors100[2].name = "Dr. Priya Nair";
doctors100[2].specialization = "Dermatologist";
doctors100[2].isRegistered = true;

doctors100[3].assignedEmail = "doctor4@hospital.com";
doctors100[3].name = "Dr. Arjun Kapoor";
doctors100[3].specialization = "Neurologist";
doctors100[3].isRegistered = true;

doctors100[4].assignedEmail = "doctor5@hospital.com";
doctors100[4].name = "Dr. Kavitha Reddy";
doctors100[4].specialization = "Pediatrician";
doctors100[4].isRegistered = true;

module.exports = doctors100;

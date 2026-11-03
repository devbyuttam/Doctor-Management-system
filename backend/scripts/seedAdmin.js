const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config({ path: './.env' });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('DB Connected for Seeding');

    const adminExists = await User.findOne({ email: 'admin@hospital.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = new User({
      name: 'System Administrator',
      email: 'admin@hospital.com',
      passwordHash: 'Admin@123456',
      role: 'admin',
      status: 'active'
    });
    
    await admin.save();
    console.log('Admin account created: email: admin@hospital.com, password: Admin@123456');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();

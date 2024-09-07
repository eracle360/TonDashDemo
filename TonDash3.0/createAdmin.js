const mongoose = require('mongoose');
const Admin = require('./models/adminModel');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      const admin = new Admin({
        username: 'admin',
        password: 'password', // Change this to a more secure password
      });

      await admin.save();
      console.log('Admin user created');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createAdmin();

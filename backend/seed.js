const dotenv = require('dotenv').config();
const connectDB = require("./src/config/db");
const UserModule = require('./src/module/User.module');
const bcrypt = require("bcrypt");

const temporaryPassword = 'admin123';

async function registerAdmin() {
    try {
       
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        if (!ADMIN_EMAIL) {
            console.error('Missing ADMIN_EMAIL environment variable');
            process.exit(1);            
        }

        // 2. Connect to the database
        await connectDB();

        const existingAdmin = await UserModule.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log('User already exists with role:', existingAdmin.role);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // 5. Complete the Admin creation block
        const newAdmin = new UserModule({
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin' 
        });

        await newAdmin.save();
        
        console.log('Admin user registered successfully!');
        console.log('/nemail:',ADMIN_EMAIL);
        console.log('password:',temporaryPassword);
        process.exit(0);

    } catch (error) {
        console.error('Error registering admin:', error);
        process.exit(1);
    }
}

// Execute the function
registerAdmin();

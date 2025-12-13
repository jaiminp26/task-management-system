const mongoose = require('mongoose');
const User = require('./backend/models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const user = await User.findOne({ email: 'user1@example.com' });
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${user.email} is now an admin`);
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};

makeAdmin();

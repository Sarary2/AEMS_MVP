import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "sarary2000@gmail.com" });
  if (existing) {
    console.log("✅ User already exists:", existing);
  } else {
    const user = new User({
      email: "sarary2000@gmail.com",
      devices: ["infusion pump", "defibrillator"],
    });
    await user.save();
    console.log("✅ New user created:", user);
  }

  mongoose.disconnect();
};

run();

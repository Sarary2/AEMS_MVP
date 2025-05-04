import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  devices: { type: [String], default: [] }
});

const User = mongoose.model('User', userSchema);
export default User;

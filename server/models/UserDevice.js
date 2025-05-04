import mongoose from 'mongoose';

const userDeviceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true }
}, { timestamps: true });

const UserDevice = mongoose.model('UserDevice', userDeviceSchema);
export default UserDevice;

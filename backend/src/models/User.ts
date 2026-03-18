import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  avatar: { type: String, default: null },
  department: { type: String, default: null },
  phone: { type: String, default: null },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  assignmentsCount: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next: any) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model('User', userSchema);

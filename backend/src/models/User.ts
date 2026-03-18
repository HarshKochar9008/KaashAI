import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  institution: string;
  location: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  institution: { type: String, default: '' },
  location: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform(_doc, ret) {
    const { password: _, ...rest } = ret;
    return rest;
  },
});

export const User = mongoose.model<IUser>('User', userSchema);

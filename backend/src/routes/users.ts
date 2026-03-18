import { Router } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { Assignment } from '../models/Assignment';

const router = Router();

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats', async (_req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const teachers = await User.countDocuments({ role: 'teacher' });
    const students = await User.countDocuments({ role: 'student' });
    res.json({ totalUsers, activeUsers, teachers, students });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/assignments', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const assignments = await Assignment.find({ createdBy: req.params.id })
      .sort({ createdAt: -1 })
      .select('-inputFiles -result');
    res.json(assignments);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    const user = new User(data);
    await user.save();
    res.status(201).json(user);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0]?.message ?? 'Validation error' });
    }
    res.status(400).json({ error: err.message || 'Validation error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = updateUserSchema.parse(req.body);
    if (data.email) {
      const existing = await User.findOne({ email: data.email, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(409).json({ error: 'Email already in use by another user' });
      }
    }
    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0]?.message ?? 'Validation error' });
    }
    res.status(400).json({ error: err.message || 'Validation error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

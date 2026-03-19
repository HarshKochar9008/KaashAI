import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
const pdfParse = require('pdf-parse');
import { Assignment } from '../models/Assignment';
import { generationQueue } from '../config/queue';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const sectionSchema = z.object({
  type: z.string(),
  count: z.number().min(1, 'Count must be at least 1').max(50),
  difficulty: z.string(),
  marksPerQuestion: z.number().min(1, 'Marks must be at least 1').default(1)
});

const assignmentBodySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  totalMarks: z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  additionalInstructions: z.string().optional(),
  sections: z.string().transform((str) => {
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  }).pipe(z.array(sectionSchema).optional())
});

router.post('/', authMiddleware, upload.array('files'), async (req: AuthRequest, res) => {
  try {
    const data = assignmentBodySchema.parse(req.body);

    const inputFiles = [];
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      for (const file of req.files as Express.Multer.File[]) {
        let content = '';
        if (file.mimetype === 'application/pdf') {
          const pdfData = await pdfParse(file.buffer);
          content = pdfData.text;
        } else if (file.mimetype === 'text/plain') {
          content = file.buffer.toString('utf-8');
        } else {
          continue;
        }
        inputFiles.push({
          filename: file.originalname,
          content,
          mimetype: file.mimetype
        });
      }
    }

    const assignment = new Assignment({
      userId: req.userId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      totalMarks: data.totalMarks || null,
      additionalInstructions: data.additionalInstructions || '',
      inputFiles,
      sections: data.sections || []
    });

    await assignment.save();

    await generationQueue.add('generate-exam', { assignmentId: assignment._id.toString() });

    res.status(201).json({ id: assignment._id.toString(), status: 'pending' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Validation error' });
  }
});

router.post('/:id/regenerate', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, userId: req.userId });
    if (!assignment) {
      return res.status(404).json({ error: 'Not found' });
    }

    assignment.status = 'pending';
    assignment.result = null;
    assignment.error = null;
    await assignment.save();

    await generationQueue.add('generate-exam', { assignmentId: assignment._id.toString() });

    res.json({ id: assignment._id.toString(), status: 'pending' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, userId: req.userId });
    if (!assignment) {
      return res.status(404).json({ error: 'Not found' });
    }
    const { inputFiles, ...copy } = assignment.toObject();
    res.json(copy);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const list = await Assignment.find({ userId: req.userId }).sort({ createdAt: -1 }).select('-inputFiles -result');
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

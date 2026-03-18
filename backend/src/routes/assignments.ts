import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
const pdfParse = require('pdf-parse');
import { Assignment } from '../models/Assignment';
import { generationQueue } from '../config/queue';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const sectionSchema = z.object({
  type: z.string(),
  count: z.number(),
  difficulty: z.string()
});

const assignmentBodySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  sections: z.string().transform((str) => {
    try {
      return JSON.parse(str); // Sections as JSON string on formdata
    } catch {
      return [];
    }
  }).pipe(z.array(sectionSchema).optional())
});

router.post('/', upload.array('files'), async (req, res) => {
  try {
    const data = assignmentBodySchema.parse(req.body);

    const inputFiles = [];
    if (req.files) {
      for (const file of req.files as Express.Multer.File[]) {
        let content = '';
        if (file.mimetype === 'application/pdf') {
          const pdfData = await pdfParse(file.buffer);
          content = pdfData.text;
        } else if (file.mimetype === 'text/plain') {
          content = file.buffer.toString('utf-8');
        } else {
          continue; // skip other formats
        }
        inputFiles.push({
          filename: file.originalname,
          content,
          mimetype: file.mimetype
        });
      }
    }

    const assignment = new Assignment({
      title: data.title,
      description: data.description,
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

router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Not found' });
    }
    // Omit large content fields from response for performance usually, but maybe they want it
    const { inputFiles, ...copy } = assignment.toObject();
    res.json(copy);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const list = await Assignment.find().sort({ createdAt: -1 }).select('-inputFiles -result');
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

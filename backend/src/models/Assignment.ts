import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  inputFiles: [{ 
    filename: String,
    content: String,
    mimetype: String
  }],
  sections: [{
    type: { type: String }, // e.g., 'mcq', 'short_answer', 'essay'
    count: { type: Number },
    difficulty: { type: String }
  }],
  result: { type: Object, default: null },
  error: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

assignmentSchema.pre('save', function(next) {
  this.set('updatedAt', new Date());
  next();
});

export const Assignment = mongoose.model('Assignment', assignmentSchema);

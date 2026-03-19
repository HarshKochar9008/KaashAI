import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  title: { type: String, required: true },
  description: { type: String, required: false },
  dueDate: { type: Date, default: null },
  totalMarks: { type: Number, default: null },
  additionalInstructions: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  inputFiles: [{ 
    filename: String,
    content: String,
    mimetype: String
  }],
  sections: [{
    type: { type: String },
    count: { type: Number },
    difficulty: { type: String },
    marksPerQuestion: { type: Number, default: 1 }
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

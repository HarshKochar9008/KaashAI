import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Assignment } from '../models/Assignment';
import { generateExamContent } from '../services/aiService';

dotenv.config();

// We can just use a separate Redis connection to publish WS messages directly if they are running in different processes,
// but for simplicity let's use a simple pub/sub approach to notify the main server.
const pub = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});
const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vedaai');

const updateStatus = async (jobId: string, statusText: string) => {
  console.log(`Job ${jobId}: ${statusText}`);
  await pub.publish('ws_broadcast', JSON.stringify({
    type: 'job_progress',
    jobId,
    status: statusText
  }));
};

const worker = new Worker('exam-generation', async (job: Job) => {
  const { assignmentId } = job.data;
  
  await updateStatus(assignmentId, 'Initializing task...');
  
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');
    
    assignment.status = 'processing';
    await assignment.save();
    
    // Merge context
    await updateStatus(assignmentId, 'Reading files...');
    const contextText = assignment.inputFiles.map((f: any) => f.content).join('\n\n');
    let sections: any[] = assignment.sections || [];
    if (sections.length === 0) {
      // Default
      sections = [{ type: 'multiple_choice', count: 5, difficulty: 'medium' }];
    }

    const result = await generateExamContent(contextText, sections, (statusText) => {
      updateStatus(assignmentId, statusText);
    });

    assignment.result = result;
    assignment.status = 'completed';
    await assignment.save();
    
    await updateStatus(assignmentId, 'Completed');
    return assignment.result;
    
  } catch (error: any) {
    console.error('Worker error:', error);
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'failed',
      error: error.message
    });
    await updateStatus(assignmentId, `Error: ${error.message}`);
    throw error;
  }
}, { connection: redisConnection as any });

worker.on('ready', () => {
    console.log('Worker is running and waiting for jobs on queue "exam-generation"');
});

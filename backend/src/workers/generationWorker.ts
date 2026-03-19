import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Assignment } from '../models/Assignment';
import { generateExamContent, SectionInput } from '../services/aiService';

dotenv.config();

const pub = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL)
  : new IORedis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });

const redisConnection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  : new IORedis({
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

    await updateStatus(assignmentId, 'Reading files...');

    // Limit total context size so very large uploads don't make generation extremely slow.
    const MAX_CONTEXT_CHARS = 20000;
    let contextText = assignment.inputFiles.map((f: any) => f.content).join('\n\n');
    if (contextText.length > MAX_CONTEXT_CHARS) {
      contextText = contextText.slice(0, MAX_CONTEXT_CHARS);
      console.log(
        `Job ${assignmentId}: context truncated to ${MAX_CONTEXT_CHARS} characters from ${assignment.inputFiles
          .map((f: any) => f.content.length)
          .reduce((a: number, b: number) => a + b, 0)} total`
      );
    }

    let sections: SectionInput[] = (assignment.sections || []).map((s: any) => ({
      type: s.type || 'MCQ',
      count: s.count || 5,
      difficulty: s.difficulty || 'medium',
      marksPerQuestion: s.marksPerQuestion || 1,
    }));

    if (sections.length === 0) {
      sections = [{ type: 'MCQ', count: 5, difficulty: 'medium', marksPerQuestion: 1 }];
    }

    const additionalInstructions = (assignment as any).additionalInstructions || '';

    const result = await generateExamContent(contextText, sections, additionalInstructions, (statusText) => {
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

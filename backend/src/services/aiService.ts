import Groq from 'groq-sdk';
import { z } from 'zod';

let groq: Groq;
const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
  return groq;
};

const questionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).optional(),
  answer: z.string(),
  explanation: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  marks: z.number().min(1),
});

const sectionOutputSchema = z.object({
  section_title: z.string(),
  instruction: z.string(),
  questions: z.array(questionSchema),
});

const examOutputSchema = z.object({
  title: z.string(),
  totalMarks: z.number(),
  duration: z.string(),
  sections: z.array(sectionOutputSchema),
});

export interface SectionInput {
  type: string;
  count: number;
  difficulty: string;
  marksPerQuestion: number;
}

export const generateExamContent = async (
  context: string,
  sections: SectionInput[],
  additionalInstructions: string = '',
  progressCallback?: (status: string) => void
) => {
  if (progressCallback) progressCallback('Building prompt...');

  const totalMarks = sections.reduce((sum, s) => sum + s.count * s.marksPerQuestion, 0);

  const sectionDescriptions = sections.map((s, i) => {
    const label = String.fromCharCode(65 + i);
    return `Section ${label}: EXACTLY ${s.count} questions (no more, no less) of type "${s.type}" at "${s.difficulty}" difficulty, each worth ${s.marksPerQuestion} mark(s).`;
  }).join('\n');

  const instruction = `
You are an expert examiner. Generate an exam paper based on the following.

${context ? `Context material:\n"""\n${context}\n"""` : 'No reference material provided. Generate questions on general knowledge appropriate to the question types.'}

${additionalInstructions ? `Additional instructions from the teacher:\n"${additionalInstructions}"` : ''}

Required sections:
${sectionDescriptions}

Total marks: ${totalMarks}

RULES:
- CRITICAL: Each section MUST contain EXACTLY the number of questions specified above. Do NOT generate more or fewer.
- Each question MUST include a "difficulty" field with value "easy", "medium", or "hard" matching the section difficulty.
- Each question MUST include a "marks" field (integer).
- Each section MUST include an "instruction" field (e.g. "Attempt all questions. Each question carries 2 marks.").
- For MCQ / True/False type questions, include an "options" array with exactly 4 options.
- For Short Answer / Essay type questions, do NOT include "options".
- Every question must have an "answer" and a concise "explanation" (1-2 sentences max).

Return ONLY valid JSON with this exact schema:
{
  "title": "A suitable exam title",
  "totalMarks": ${totalMarks},
  "duration": "Estimated time e.g. 2 Hours",
  "sections": [
    {
      "section_title": "Section A: Multiple Choice Questions",
      "instruction": "Attempt all questions. Each question carries 1 mark.",
      "questions": [
        {
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": "Correct answer",
          "explanation": "Brief explanation",
          "difficulty": "easy",
          "marks": 1
        }
      ]
    }
  ]
}

Return ONLY valid JSON. Do not include any markdown formatting other than \`\`\`json wrapper.
`;

  const truncatedContext = context.length > 12000 ? context.slice(0, 12000) + '\n[...content truncated for length...]' : context;

  const finalInstruction = instruction.replace(context, truncatedContext);

  if (progressCallback) progressCallback('Sending to Groq AI...');
  const client = getGroqClient();
  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are an expert exam paper creator. You respond ONLY with structured JSON following the exact schema requested. Never add commentary outside the JSON. Keep explanations concise (1-2 sentences max).' },
      { role: 'user', content: finalInstruction }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 8192,
  });

  if (progressCallback) progressCallback('Parsing response...');

  const choice = chatCompletion.choices[0];
  if (!choice) {
    throw new Error('No response from AI model.');
  }

  if (choice.finish_reason === 'length') {
    console.warn('LLM response was truncated due to max_tokens limit.');
  }

  let content = choice.message?.content || '';

  const jsonStr = extractJSON(content);
  if (!jsonStr) {
    throw new Error('Could not extract JSON from AI response.');
  }

  const parsed = JSON.parse(jsonStr);

  if (progressCallback) progressCallback('Validating structure...');

  // Enforce exact question counts per section
  if (parsed.sections && Array.isArray(parsed.sections)) {
    parsed.sections.forEach((section: any, i: number) => {
      if (sections[i] && section.questions && Array.isArray(section.questions)) {
        const expected = sections[i].count;
        if (section.questions.length > expected) {
          console.warn(`Section ${i} has ${section.questions.length} questions, trimming to ${expected}`);
          section.questions = section.questions.slice(0, expected);
        }
      }
    });
    // Recalculate totalMarks from actual questions
    parsed.totalMarks = parsed.sections.reduce((sum: number, sec: any) => {
      return sum + (sec.questions || []).reduce((qSum: number, q: any) => qSum + (q.marks || 0), 0);
    }, 0);
  }

  const validated = examOutputSchema.safeParse(parsed);
  if (!validated.success) {
    console.warn('LLM output did not pass strict validation, using raw parsed result. Issues:', validated.error.issues);
    return parsed;
  }

  if (progressCallback) progressCallback('Validation complete.');
  return validated.data;
};

function extractJSON(text: string): string | null {
  let str = text.trim();

  const fenceMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    str = (fenceMatch[1] || '').trim();
  }

  const startIdx = str.indexOf('{');
  if (startIdx === -1) return null;
  str = str.slice(startIdx);

  try {
    JSON.parse(str);
    return str;
  } catch {
    // Response may be truncated -- try to repair by closing open brackets
  }

  return repairJSON(str);
}

function repairJSON(str: string): string {
  let repaired = str.replace(/,\s*([}\]])/g, '$1');

  const opens: string[] = [];
  let inString = false;
  let escape = false;

  for (const ch of repaired) {
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{' || ch === '[') opens.push(ch);
    if (ch === '}' || ch === ']') opens.pop();
  }

  // If stuck inside a string, close it
  if (inString) repaired += '"';

  while (opens.length > 0) {
    const open = opens.pop();
    repaired += open === '{' ? '}' : ']';
  }

  try {
    JSON.parse(repaired);
    return repaired;
  } catch (e) {
    throw new Error(`Failed to parse or repair AI JSON response: ${(e as Error).message}`);
  }
}

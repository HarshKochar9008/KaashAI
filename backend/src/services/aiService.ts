import Groq from 'groq-sdk';

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

export const generateExamContent = async (
  context: string,
  sections: Array<{ type: string, count: number, difficulty: string }>,
  progressCallback?: (status: string) => void
) => {
  if (progressCallback) progressCallback('Building prompt...');

  const instruction = `
You are an expert examiner. Given the following context material:
"""
${context}
"""

You need to generate an exam with the following sections:
${sections.map((s, i) => `Section ${i + 1}: ${s.count} questions of type '${s.type}' at '${s.difficulty}' difficulty.`).join('\n')}

Format the output strictly as JSON with this schema:
{
  "title": "A suitable title",
  "sections": [
    {
      "section_title": "Section Name",
      "questions": [
        {
          "question": "Question text",
          "options": ["A", "B", "C", "D"], // if multiple choice
          "answer": "Correct answer",
          "explanation": "Why it is correct"
        }
      ]
    }
  ]
}
Return ONLY valid JSON. Do not include any other markdown formatting other than \`\`\`json.
`;

  if (progressCallback) progressCallback('Sending to Groq AI...');
  const client = getGroqClient();
  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: 'system', content: "You are an expert exam creator. Respond only with structured JSON." },
      { role: 'user', content: instruction }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
  });

  if (progressCallback) progressCallback('Parsing response...');

  const choice = chatCompletion.choices[0];
  if (!choice) {
    throw new Error('No response from AI model.');
  }
  let content = choice.message?.content || '';

  const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || content.match(/(\{[\s\S]*\})/);
  if (!jsonMatch || !jsonMatch[1]) {
    throw new Error('Could not parse JSON from response.');
  }

  const result = JSON.parse(jsonMatch[1]);
  if (progressCallback) progressCallback('Validation complete.');

  return result;
};

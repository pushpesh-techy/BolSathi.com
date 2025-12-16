const buildAssessmentPrompt = (targetLanguage) => `
You are a language proficiency assessor.
Based on the user's answers, classify their level in ${targetLanguage} as:
Beginner, Intermediate, or Advanced.
Be conservative. If unsure or answers are mixed, choose the lower level.
Return ONLY the level label.
`;
const fetchFn = globalThis.fetch;

const buildSystemPrompt = (targetLanguage, level) => `
You are a friendly, patient language tutor for Indian learners.
The user may use English, Hindi, Hinglish, or mix languages.
The user is learning ${targetLanguage} and their level is ${level}.
Your goals:
- Correct mistakes politely and clearly
- Prefer simple explanations over technical grammar terms
- When helpful, give examples relevant to Indian context
- If user uses Hinglish, reply in Hinglish unless asked otherwise
- Encourage the learner with short positive feedback
- Never invent facts or rules. If unsure, say you are unsure.
- Keep responses concise and conversational.
`;

async function getTutorReply({ message, targetLanguage = 'the target language', level = 'beginner' }) {
  if (!message) {
    throw new Error('Message is required');
  }

  if (typeof fetchFn !== 'function') {
    throw new Error('Fetch is not available in this runtime (requires Node 18+)');
  }

  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error('LLM_API_KEY is not set');
  }

  const url = process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.LLM_MODEL || 'gpt-3.5-turbo';

  const systemPrompt = buildSystemPrompt(targetLanguage, level);

  const response = await fetchFn(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 256,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error('LLM reply was empty');
  }

  return reply;
}

async function getAssessmentLevel({ answers = [], targetLanguage = 'the target language' }) {
  if (!Array.isArray(answers) || answers.length === 0) {
    throw new Error('Answers are required');
  }

  if (typeof fetchFn !== 'function') {
    throw new Error('Fetch is not available in this runtime (requires Node 18+)');
  }

  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error('LLM_API_KEY is not set');
  }

  const url = process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.LLM_MODEL || 'gpt-3.5-turbo';

  const systemPrompt = buildAssessmentPrompt(targetLanguage);
  const userContent = answers.map((a, idx) => `Q${idx + 1}: ${a}`).join('\n');

  const response = await fetchFn(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.2,
      max_tokens: 10,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error('LLM assessment reply was empty');
  }

  // Normalize to expected labels
  const normalized = reply.toLowerCase();
  if (normalized.includes('advanced')) return 'Advanced';
  if (normalized.includes('intermediate')) return 'Intermediate';
  return 'Beginner';
}

const buildExplainPrompt = ({ mode, targetLanguage }) => `
You are a language assistant for Indian learners.
- For 'translate', provide natural, commonly spoken translations (not textbook-heavy) into ${targetLanguage || 'English'}.
- For 'explain', explain in simple terms, optionally using Hinglish if helpful.
- Avoid excessive grammar jargon.
- If meaning is ambiguous, explain both possibilities briefly.
Mode: ${mode}
`;

async function explainOrTranslate({ text, mode = 'explain', targetLanguage = 'English' }) {
  if (!text) {
    throw new Error('Text is required');
  }
  if (mode !== 'explain' && mode !== 'translate') {
    throw new Error('Mode must be explain or translate');
  }

  if (typeof fetchFn !== 'function') {
    throw new Error('Fetch is not available in this runtime (requires Node 18+)');
  }

  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error('LLM_API_KEY is not set');
  }

  const url = process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.LLM_MODEL || 'gpt-3.5-turbo';

  const systemPrompt = buildExplainPrompt({ mode, targetLanguage });

  const response = await fetchFn(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new Error('LLM reply was empty');
  }
  return reply;
}

module.exports = { getTutorReply, getAssessmentLevel, explainOrTranslate };


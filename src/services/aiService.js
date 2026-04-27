import { ENTRY_INSIGHT_PROMPT, WEEKLY_DIGEST_PROMPT } from '../constants/prompts';
import { logger } from '../utils/logger';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL   = 'gemini-2.5-flash';

/**
 * Base fetch wrapper for Gemini API.
 * Note: In production, API calls should go through a backend proxy.
 */
async function callGemini(prompt, maxTokens = 512) {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to .env');
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        maxOutputTokens: maxTokens,
      }
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * Generate AI insight for a single journal entry.
 * @param {string} content - Journal entry content
 * @returns {Promise<{reflection: string, suggestion: string, question: string}>}
 */
export async function generateEntryInsight(content) {
  const prompt = ENTRY_INSIGHT_PROMPT(content);
  const raw = await callGemini(prompt, 600);

  // Extract JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    logger.error('Gemini response did not contain JSON:', raw);
    throw new Error('AI returned an unexpected format. Please try again.');
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.reflection || !parsed.suggestion || !parsed.question) {
      throw new Error('Incomplete AI response');
    }
    return {
      reflection: parsed.reflection,
      suggestion: parsed.suggestion,
      question:   parsed.question,
    };
  } catch {
    throw new Error('Could not parse AI insight. Please try again.');
  }
}

/**
 * Generate a weekly digest from multiple entries.
 * @param {Array<{title: string, content: string, mood: string, date: string}>} entries
 * @returns {Promise<string>} A paragraph summary
 */
export async function generateWeeklyDigest(entries) {
  if (!entries.length) {
    throw new Error('No entries to summarize.');
  }
  const prompt = WEEKLY_DIGEST_PROMPT(entries);
  const raw = await callGemini(prompt, 400);
  return raw.trim();
}

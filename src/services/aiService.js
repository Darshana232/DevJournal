import { ENTRY_INSIGHT_PROMPT, WEEKLY_DIGEST_PROMPT } from '../constants/prompts';
import { logger } from '../utils/logger';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-haiku-4-5';

/**
 * Base fetch wrapper for Anthropic API.
 * Note: In production, API calls should go through a backend proxy.
 * For this client-side demo, CORS is handled via Anthropic's direct API.
 */
async function callClaude(prompt, maxTokens = 512) {
  if (!API_KEY) {
    throw new Error('Anthropic API key not configured. Add VITE_ANTHROPIC_API_KEY to .env');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type':            'application/json',
      'x-api-key':               API_KEY,
      'anthropic-version':       '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? '';
}

/**
 * Generate AI insight for a single journal entry.
 * @param {string} content - Journal entry content
 * @returns {Promise<{reflection: string, suggestion: string, question: string}>}
 */
export async function generateEntryInsight(content) {
  const prompt = ENTRY_INSIGHT_PROMPT(content);
  const raw = await callClaude(prompt, 600);

  // Extract JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    logger.error('Claude response did not contain JSON:', raw);
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
  const raw = await callClaude(prompt, 400);
  return raw.trim();
}

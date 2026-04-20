/** AI prompt templates for Anthropic Claude */

/**
 * @param {string} content - The journal entry content
 * @returns {string} Formatted prompt
 */
export const ENTRY_INSIGHT_PROMPT = (content) => `You are a thoughtful mentor for a software developer. Analyze this journal entry and provide exactly:

1) REFLECTION: One key reflection (2–3 sentences). Be direct about what you observe.
2) SUGGESTION: One concrete, actionable suggestion. Make it specific and implementable.
3) QUESTION: One thought-provoking question. Make it specific to the entry, not generic.

Rules:
- Be concise and direct. No filler phrases or cheerleading.
- Do not start with "Great entry!" or similar platitudes.
- Respond in exactly this JSON format:
{
  "reflection": "...",
  "suggestion": "...",
  "question": "..."
}

Journal Entry:
${content}`;

/**
 * @param {Array<{title: string, content: string, mood: string, date: string}>} entries
 * @returns {string} Formatted prompt
 */
export const WEEKLY_DIGEST_PROMPT = (entries) => {
  const formatted = entries
    .map((e, i) => `Entry ${i + 1} (${e.date}, mood: ${e.mood}):\n${e.content}`)
    .join('\n\n---\n\n');

  return `You are a thoughtful mentor analyzing a developer's week of journal entries. 

Based on these ${entries.length} entries, write a concise paragraph (4–6 sentences) that:
- Identifies the dominant theme or pattern
- Notes any recurring challenges or struggles
- Highlights one genuine strength demonstrated
- Offers one forward-looking perspective

Be direct, non-generic, and specific to what was actually written. Do not be a cheerleader.

Respond with ONLY the paragraph, no headers or labels.

Entries:
${formatted}`;
};

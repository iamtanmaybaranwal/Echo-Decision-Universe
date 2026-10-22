import { themes } from '../data/scenarioLibrary';
import { createRng } from './random';

const LETTERS = ['A', 'B', 'C'];

export function hashString(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Picks the theme whose keywords appear most often in the question.
 * A tie between themes is ambiguous, so it falls back to the general set.
 */
export function classifyQuestion(question) {
  const text = ` ${question.toLowerCase()} `;
  const scored = Object.entries(themes)
    .map(([id, theme]) => ({
      id,
      score: theme.keywords.filter((word) => new RegExp(`\\b${word}\\b`).test(text)).length,
    }))
    .sort((a, b) => b.score - a.score);

  const [first, second] = scored;
  if (first.score === 0 || first.score === second.score) return 'general';
  return first.id;
}

const LEADING_PHRASES =
  /^(should i|what if i|what happens if i|what would happen if i|do i|can i|could i|would it be wise to|is it worth it to|is it a good idea to|is it smart to|am i ready to)\s+/i;

const PRONOUNS = [
  [/\bI'm\b/gi, "you're"],
  [/\bI am\b/gi, 'you are'],
  [/\bI've\b/gi, "you've"],
  [/\bmyself\b/gi, 'yourself'],
  [/\bmine\b/gi, 'yours'],
  [/\bmy\b/gi, 'your'],
  [/\bme\b/gi, 'you'],
  [/\bI\b/g, 'you'],
];

/**
 * Turns "Should I move to Lisbon?" into "move to Lisbon".
 * Falls back to a neutral phrase when the question isn't phrased as an action.
 */
export function extractAction(question) {
  const cleaned = question.trim().replace(/[?.!]+$/, '');
  if (!LEADING_PHRASES.test(cleaned)) return 'go ahead with it';

  let action = cleaned.replace(LEADING_PHRASES, '');
  PRONOUNS.forEach(([pattern, replacement]) => {
    action = action.replace(pattern, replacement);
  });
  return action.length > 70 ? 'go ahead with it' : action;
}

const fill = (text, action) => text.replaceAll('{action}', action);

/**
 * Builds a full decision universe for a question: three branches,
 * each with two outcomes. Deterministic for a given question.
 */
export function buildScenario(question) {
  const seed = hashString(question.trim().toLowerCase());
  const rand = createRng(seed);
  const themeId = classifyQuestion(question);
  const theme = themes[themeId];
  const action = extractAction(question);

  const branches = theme.branches.map((branch, b) => {
    const branchId = `branch-${LETTERS[b].toLowerCase()}`;
    // Nudge the odds a little per question so different questions feel distinct.
    const shift = Math.round((rand() - 0.5) * 12);
    const first = Math.min(85, Math.max(15, branch.outcomes[0].likelihood + shift));

    return {
      id: branchId,
      letter: LETTERS[b],
      title: branch.title,
      tag: branch.tag,
      description: fill(branch.description, action),
      steps: branch.steps,
      outcomes: branch.outcomes.map((outcome, o) => ({
        ...outcome,
        id: `${branchId}-${o + 1}`,
        branchId,
        description: fill(outcome.description, action),
        likelihood: o === 0 ? first : 100 - first,
      })),
    };
  });

  return {
    id: seed.toString(36),
    question: question.trim(),
    theme: { id: themeId, label: theme.label },
    branches,
  };
}

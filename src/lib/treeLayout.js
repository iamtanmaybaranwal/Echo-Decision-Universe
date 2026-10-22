/**
 * Pure layout for the decision tree, in pixel units of the measured canvas.
 *
 * - "horizontal": root on the left, branches in the middle, outcomes on the
 *   right with labels beside them. Used when there is room.
 * - "list": an indented, top-down tree (like a file tree) that scrolls.
 *   Used on narrow or short screens so labels always have full width.
 */

import { TONES } from '../data/scenarioLibrary';

export const RADIUS = { root: 17, branch: 11, outcome: 8 };

/** Row heights of a node label, shared with TreeNode so layout can measure fit. */
export const LABEL_LINE_HEIGHT = { caption: 15, title: 17, meta: 15 };
export const LABEL_GAP = 11;

const CHAR_WIDTH = 7.4; // ~average glyph width at 14px Space Grotesk
// Hard floor; above it, horizontalLayout checks whether the actual labels fit.
const HORIZONTAL_MIN = { width: 600, height: 400 };

const labelHeight = (label) =>
  (label.caption ? LABEL_LINE_HEIGHT.caption : 0) +
  label.lines.length * LABEL_LINE_HEIGHT.title +
  (label.meta ? LABEL_LINE_HEIGHT.meta : 0);

const clamp = (min, value, max) => Math.min(max, Math.max(min, value));

/** Greedy word wrap with an ellipsis on the last allowed line. */
export function wrapText(text, maxChars, maxLines = 2) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  for (let i = 0; i < words.length; i += 1) {
    const candidate = current ? `${current} ${words[i]}` : words[i];
    if (candidate.length <= maxChars || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
      if (lines.length === maxLines) {
        current = '';
        lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[\s,.;:]+$/, '')}…`;
        break;
      }
    }
  }
  if (current) lines.push(current);
  return lines.map((line) => (line.length > maxChars + 2 ? `${line.slice(0, maxChars - 1)}…` : line));
}

const charsFor = (px) => Math.max(10, Math.floor(px / CHAR_WIDTH));

function nodeLabels(scenario, widths) {
  const root = {
    caption: 'Origin',
    lines: ['This moment'],
  };
  const branches = scenario.branches.map((b) => ({
    caption: `Path ${b.letter} · ${b.tag}`,
    lines: wrapText(b.title, charsFor(widths.branch), 2),
  }));
  const outcomes = scenario.branches.map((b) =>
    b.outcomes.map((o) => ({
      lines: wrapText(o.title, charsFor(widths.outcome), 2),
      meta: `${o.likelihood}% · ${TONES[o.tone].label}`,
    })),
  );
  return { root, branches, outcomes };
}

function horizontalLayout(scenario, width, height) {
  const padX = clamp(20, width * 0.04, 56);
  const padY = 34;
  const outcomeLabelW = clamp(150, width * 0.27, 250);
  const rootX = padX + 52;
  const outcomeX = width - padX - outcomeLabelW - RADIUS.outcome - 14;
  const branchX = rootX + (outcomeX - rootX) * 0.5;
  const branchLabelW = clamp(110, (outcomeX - rootX) * 0.5 - 30, 180);

  const groupGap = clamp(14, height * 0.045, 40);
  // The 40px reserve keeps room for the outer branch labels above and below.
  const slot = Math.min((height - padY * 2 - groupGap * 2 - 40) / 6, 110);
  const blockH = slot * 6 + groupGap * 2;
  const top = (height - blockH) / 2;

  const labels = nodeLabels(scenario, { branch: branchLabelW, outcome: outcomeLabelW });

  // Bail out to the list layout if outcome labels would touch, or the outer
  // branch labels (above path A, below path C) would leave the canvas.
  const tallestOutcome = Math.max(...labels.outcomes.flat().map(labelHeight));
  const tallestBranch = Math.max(...labels.branches.map(labelHeight));
  const outerBranchRoom = top + slot - RADIUS.branch - LABEL_GAP;
  if (slot < tallestOutcome + 4 || outerBranchRoom < tallestBranch + 4) return null;

  const nodes = [];
  const edges = [];

  const branchYs = scenario.branches.map((branch, g) => {
    const ys = branch.outcomes.map((_, i) => top + slot * (g * 2 + i) + slot / 2 + groupGap * g);
    return { ys, y: (ys[0] + ys[1]) / 2 };
  });
  const rootY = branchYs[1].y;

  nodes.push({
    id: 'root', kind: 'root', depth: 0, x: rootX, y: rootY, r: RADIUS.root,
    label: { ...labels.root, anchor: 'below' },
  });

  scenario.branches.forEach((branch, g) => {
    const { y, ys } = branchYs[g];
    // The incoming curve arrives from the root's side, so put the label on the far side.
    nodes.push({
      id: branch.id, kind: 'branch', depth: 1, x: branchX, y, r: RADIUS.branch,
      label: { ...labels.branches[g], anchor: y > rootY ? 'below' : 'above' },
    });
    edges.push({ id: `root>${branch.id}`, from: 'root', to: branch.id, depth: 1, d: curve(rootX, rootY, branchX, y) });

    branch.outcomes.forEach((outcome, i) => {
      nodes.push({
        id: outcome.id, kind: 'outcome', tone: outcome.tone, depth: 2, x: outcomeX, y: ys[i], r: RADIUS.outcome,
        label: { ...labels.outcomes[g][i], anchor: 'right' },
      });
      edges.push({ id: `${branch.id}>${outcome.id}`, from: branch.id, to: outcome.id, depth: 2, d: curve(branchX, y, outcomeX, ys[i]) });
    });
  });

  return { mode: 'horizontal', width, height, nodes, edges };
}

function listLayout(scenario, width) {
  const padX = 18;
  const padTop = 30;
  const rowH = 66;
  const rootX = padX + RADIUS.root;
  const branchX = rootX + 30;
  const outcomeX = branchX + 32;
  const labelW = (x, r) => width - x - r - 16 - padX;

  const labels = nodeLabels(scenario, {
    branch: labelW(branchX, RADIUS.branch),
    outcome: labelW(outcomeX, RADIUS.outcome),
  });
  const nodes = [];
  const edges = [];
  let row = 0;
  const yFor = (r) => padTop + rowH * r + rowH / 2;

  const rootY = yFor(row);
  nodes.push({
    id: 'root', kind: 'root', depth: 0, x: rootX, y: rootY, r: RADIUS.root,
    label: { ...labels.root, anchor: 'right' },
  });

  scenario.branches.forEach((branch, g) => {
    row += 1;
    const by = yFor(row);
    nodes.push({
      id: branch.id, kind: 'branch', depth: 1, x: branchX, y: by, r: RADIUS.branch,
      label: { ...labels.branches[g], anchor: 'right' },
    });
    edges.push({ id: `root>${branch.id}`, from: 'root', to: branch.id, depth: 1, d: elbow(rootX, rootY, branchX, by) });

    branch.outcomes.forEach((outcome, i) => {
      row += 1;
      const oy = yFor(row);
      nodes.push({
        id: outcome.id, kind: 'outcome', tone: outcome.tone, depth: 2, x: outcomeX, y: oy, r: RADIUS.outcome,
        label: { ...labels.outcomes[g][i], anchor: 'right' },
      });
      edges.push({ id: `${branch.id}>${outcome.id}`, from: branch.id, to: outcome.id, depth: 2, d: elbow(branchX, by, outcomeX, oy) });
    });
  });

  return { mode: 'list', width, height: yFor(row) + rowH / 2 + padTop, nodes, edges };
}

/** Smooth S-curve with horizontal tangents at both ends. */
function curve(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
}

/** Down-then-right elbow with a rounded corner. */
function elbow(x1, y1, x2, y2) {
  const k = Math.min(16, x2 - x1, y2 - y1);
  return `M${x1} ${y1} L${x1} ${y2 - k} Q${x1} ${y2} ${x1 + k} ${y2} L${x2} ${y2}`;
}

export function computeLayout(scenario, width, height) {
  if (!width || !height) return null;
  const roomy = width >= HORIZONTAL_MIN.width && height >= HORIZONTAL_MIN.height;
  return (roomy && horizontalLayout(scenario, width, height)) || listLayout(scenario, width);
}

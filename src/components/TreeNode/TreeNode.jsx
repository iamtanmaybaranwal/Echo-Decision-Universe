import { memo, useLayoutEffect, useRef, useState } from 'react';
import { LABEL_GAP, LABEL_LINE_HEIGHT as LINE_HEIGHT } from '../../lib/treeLayout';
import './TreeNode.css';

function labelRows(label) {
  const rows = [];
  if (label.caption) rows.push({ kind: 'caption', text: label.caption });
  label.lines.forEach((text) => rows.push({ kind: 'title', text }));
  if (label.meta) rows.push({ kind: 'meta', text: label.meta });
  return rows;
}

/** Text plus an invisible, measured rect so the whole label is clickable. */
function NodeLabel({ label, r }) {
  const textRef = useRef(null);
  const [hitBox, setHitBox] = useState(null);

  useLayoutEffect(() => {
    const box = textRef.current.getBBox();
    setHitBox({ x: box.x - 6, y: box.y - 4, width: box.width + 12, height: box.height + 8 });
  }, [label, r]);

  const rows = labelRows(label);
  const total = rows.reduce((sum, row) => sum + LINE_HEIGHT[row.kind], 0);

  let x = 0;
  let top;
  let textAnchor = 'middle';
  if (label.anchor === 'right') {
    x = r + LABEL_GAP + 2;
    top = -total / 2;
    textAnchor = 'start';
  } else if (label.anchor === 'above') {
    top = -(r + LABEL_GAP) - total;
  } else {
    top = r + LABEL_GAP;
  }

  let offset = top;
  return (
    <>
      {hitBox && <rect className="tree-node__label-hit" {...hitBox} rx="6" />}
      <text ref={textRef} className="tree-node__label" x={x} textAnchor={textAnchor}>
        {rows.map((row, i) => {
          const lh = LINE_HEIGHT[row.kind];
          const y = offset + lh * 0.74;
          offset += lh;
          return (
            <tspan key={i} className={`tree-node__${row.kind}`} x={x} y={y}>
              {row.text}
            </tspan>
          );
        })}
      </text>
    </>
  );
}

/**
 * One SVG node in the decision tree. Layered groups keep transforms separate:
 * outer <g> positions (React), __pop is animated by GSAP, __body scales on hover (CSS).
 */
function TreeNode({ node, state, ariaLabel, onSelect }) {
  const { x, y, r, kind, tone, depth, label } = node;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(node.id);
    }
  };

  return (
    <g
      className={`tree-node tree-node--${kind}${tone ? ` tree-node--${tone}` : ''} tree-node--${state}`}
      transform={`translate(${x} ${y})`}
      data-id={node.id}
      data-depth={depth}
      role="button"
      tabIndex={0}
      aria-pressed={state === 'selected'}
      aria-label={ariaLabel}
      onClick={() => onSelect(node.id)}
      onKeyDown={handleKeyDown}
    >
      <g className="tree-node__pop">
        <g className="tree-node__body">
          <circle className="tree-node__halo" r={r * 2.6} />
          <circle className="tree-node__hit" r={r + 16} />
          <circle className="tree-node__pulse" r={r + 4} />
          <circle className="tree-node__ring" r={r + 7} />
          <circle className="tree-node__focus" r={r + 11} />
          <circle className="tree-node__core" r={r} />
          {kind === 'root' && <circle className="tree-node__nucleus" r={r * 0.42} />}
        </g>
      </g>
      <g className="tree-node__label-wrap">
        <NodeLabel label={label} r={r} />
      </g>
    </g>
  );
}

export default memo(TreeNode);

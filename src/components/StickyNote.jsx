import { useState, useRef } from 'react';
import { Sparkles, Clock, HeartPulse, Brain, Wrench, Handshake, Coins, Leaf } from 'lucide-react';
import useStore from '../hooks/useStore';
import { CATEGORIES } from '../lib/constants';
import { todayKey } from '../lib/dateUtils';

const ICON_MAP = {
  HeartPulse,
  Brain,
  Wrench,
  Handshake,
  Coins,
  Leaf,
};

const CHEERS = [
  '太棒了！',
  '又近了一步！',
  '真厉害！',
  '好样的！',
  '搞定！',
  '干得漂亮！',
  '继续加油！',
  '真了不起！',
  '你就是传说！',
  '又撕掉一张！',
];

const CONFETTI_COLORS = [
  '#fde68a', '#f4b8c8', '#a8d4e6', '#a8dcc8',
  '#f4c088', '#c8b8dc', '#7eb88a', '#ff8fab',
  '#e07a3a', '#6bb5ff',
];

function spawnConfetti(x, y) {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  container.style.left = x + 'px';
  container.style.top = y + 'px';
  document.body.appendChild(container);

  for (let i = 0; i < 24; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const angle = (Math.random() * 360);
    const distance = 60 + Math.random() * 100;
    const dx = Math.cos(angle * Math.PI / 180) * distance;
    const dy = Math.sin(angle * Math.PI / 180) * distance - 40;
    const rot = Math.random() * 720 - 360;
    const size = 4 + Math.random() * 6;
    const delay = Math.random() * 0.1;

    piece.style.cssText = `
      --dx: ${dx}px;
      --dy: ${dy}px;
      --rot: ${rot}deg;
      --color: ${color};
      --size: ${size}px;
      --delay: ${delay}s;
    `;
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 1200);
}

function spawnCheer(x, y) {
  const el = document.createElement('div');
  el.className = 'cheer-text';
  el.textContent = CHEERS[Math.floor(Math.random() * CHEERS.length)];
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

function spawnXPFloat(x, y, xp) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = `+${xp} XP`;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

export default function StickyNote({ note, dateKey }) {
  const [tearing, setTearing] = useState(false);
  const noteRef = useRef(null);
  const toggleSubTask = useStore(s => s.toggleSubTask);
  const completeNote = useStore(s => s.completeNote);

  const catInfo = CATEGORIES[note.category] || {};
  const CatIcon = ICON_MAP[catInfo.icon] || HeartPulse;
  const dk = dateKey || todayKey();

  const handleSubToggle = (subId) => {
    toggleSubTask(dk, note.id, subId);
  };

  const handleComplete = (e) => {
    if (note.completed) return;
    const rect = noteRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    spawnConfetti(cx, cy);
    spawnCheer(cx - 30, cy - 60);
    spawnXPFloat(cx - 20, cy - 20, note.xp);

    setTearing(true);
    setTimeout(() => {
      completeNote(dk, note.id);
      setTearing(false);
    }, 480);
  };

  const cls = [
    'note',
    note.color || 'yellow',
    note.completed ? 'done-note' : '',
    tearing ? 'tearing' : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={noteRef} className={cls} style={{ transform: `rotate(${note.rotation || 0}deg)` }}>
      <div className="note-cat">
        <CatIcon />
        {catInfo.label || note.category}
      </div>
      <div className="note-title">{note.title}</div>
      {note.startTime && note.endTime && (
        <div className="note-time">
          <Clock size={12} /> {note.startTime} - {note.endTime}
        </div>
      )}
      {note.description && <div className="note-desc">{note.description}</div>}

      {note.subTasks && note.subTasks.length > 0 && (
        <div className="note-subs">
          {note.subTasks.map(sub => (
            <label key={sub.id} className={`sub-task${sub.done ? ' sub-done' : ''}`}>
              <input
                type="checkbox"
                className="sub-check"
                checked={sub.done}
                onChange={() => handleSubToggle(sub.id)}
              />
              <span>{sub.text}</span>
            </label>
          ))}
        </div>
      )}

      <div className="note-footer">
        <div className="note-xp">
          <Sparkles />
          {note.xp} XP
        </div>
        {!note.completed && (
          <button className="note-btn" onClick={handleComplete}>
            完成
          </button>
        )}
      </div>
    </div>
  );
}

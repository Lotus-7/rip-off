import { Plus } from 'lucide-react';
import useStore from '../hooks/useStore';
import StickyNote from './StickyNote';
import { todayKey } from '../lib/dateUtils';

export default function NoteBoard({ onAdd }) {
  const notesByDate = useStore(s => s.notesByDate);
  const activeFilter = useStore(s => s.activeFilter);

  const today = todayKey();
  const allNotes = notesByDate[today] || [];

  const filtered = activeFilter === 'all'
    ? allNotes
    : allNotes.filter(n => n.category === activeFilter);

  const active = filtered.filter(n => !n.completed);
  const sorted = [...active].sort((a, b) => {
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    if (a.startTime) return -1;
    if (b.startTime) return 1;
    return 0;
  });

  return (
    <div className="board">
      {sorted.map(note => (
        <StickyNote key={note.id} note={note} dateKey={today} />
      ))}
      <div className="note-add" onClick={onAdd}>
        <Plus />
        <span>添加便签</span>
      </div>
    </div>
  );
}

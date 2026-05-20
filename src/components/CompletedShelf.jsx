import { Sparkles, CheckCircle } from 'lucide-react';
import useStore from '../hooks/useStore';
import { todayKey } from '../lib/dateUtils';

export default function CompletedShelf() {
  const notesByDate = useStore(s => s.notesByDate);
  const today = todayKey();
  const allNotes = notesByDate[today] || [];
  const completed = allNotes.filter(n => n.completed);

  if (completed.length === 0) return null;

  return (
    <div className="shelf">
      <div className="shelf-title">
        <CheckCircle />
        已完成 ({completed.length})
      </div>
      <div className="shelf-list">
        {completed.map(note => (
          <div key={note.id} className="shelf-item">
            <div className="shelf-item-left">
              <input type="checkbox" className="shelf-check" checked readOnly />
              <span className="shelf-item-title">{note.title}</span>
            </div>
            <div className="shelf-item-xp">
              <Sparkles />
              +{note.xp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
